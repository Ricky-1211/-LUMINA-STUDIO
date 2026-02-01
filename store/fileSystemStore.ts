import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  isDirty?: boolean;
  children?: string[]; // Store child IDs, not child objects
  parentId?: string | null;
  lastModified?: number;
  size?: number;
}

export interface FileSystemState {
  // Workspace state
  workspaceRoot: string | null;
  workspaceName: string;
  files: Record<string, FileNode>;
  expandedFolders: Set<string>;
  selectedFiles: Set<string>;
  
  // File operations
  createFile: (parentId: string, name: string, content?: string) => void;
  createFolder: (parentId: string, name: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  moveFile: (id: string, newParentId: string) => void;
  updateFileContent: (id: string, content: string) => void;
  
  // Folder operations
  toggleFolder: (id: string) => void;
  expandFolder: (id: string) => void;
  collapseFolder: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Selection
  selectFile: (id: string) => void;
  selectMultipleFiles: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Workspace operations
  setWorkspaceRoot: (root: string) => void;
  loadWorkspace: () => Promise<void>;
  saveWorkspace: () => void;
  
  // File System Access API integration
  isFileSystemSupported: boolean;
  requestFileSystemAccess: () => Promise<boolean>;
  syncWithFileSystem: () => Promise<void>;
  watchFileSystem: () => void;
}

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      // Initial state
      workspaceRoot: null,
      workspaceName: 'Untitled Workspace',
      files: {},
      expandedFolders: new Set(['root']),
      selectedFiles: new Set(),
      isFileSystemSupported: false,
      
      // Request File System Access
      requestFileSystemAccess: async () => {
        try {
          // Check if File System Access API is supported
          const supported = 'showDirectoryPicker' in window && 
                          'showOpenFilePicker' in window &&
                          'getDirectoryHandle' in window;
          
          set({ isFileSystemSupported: supported });
          if (!supported) return false;
          
          // Request directory access
          const dirHandle = await (window as any).showDirectoryPicker({
            mode: 'readwrite'
          });
          
          if (dirHandle) {
            const rootName = dirHandle.name || 'workspace';
            set({ workspaceRoot: rootName, workspaceName: rootName });
            await get().loadWorkspace();
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to request file system access:', error);
          return false;
        }
      },
      
      // Load workspace from File System Access API
      loadWorkspace: async () => {
        const { workspaceRoot } = get();
        if (!workspaceRoot) return;
        
        // For now, create a virtual workspace
        // In a real implementation, this would scan the actual file system
        const virtualFiles: Record<string, FileNode> = {
          root: {
            id: 'root',
            name: workspaceRoot,
            path: '/',
            type: 'folder',
            children: [],
            parentId: null
          }
        };
        
        set({ files: virtualFiles });
      },
      
      // Save workspace state
      saveWorkspace: () => {
        const { files, workspaceRoot } = get();
        if (!workspaceRoot) return;
        
        // Save to localStorage as fallback
        localStorage.setItem('lumina-workspace', JSON.stringify({
          workspaceRoot,
          files: Object.fromEntries(
            Object.entries(files).map(([id, file]) => [
              id,
              { ...file, children: undefined } // Don't serialize children
            ])
          ),
          expandedFolders: Array.from(get().expandedFolders)
        }));
      },
      
      // Create file
      createFile: (parentId, name, content = '') => {
        const { files } = get();
        const id = `${Date.now()}-${name}`;
        const parent = files[parentId];
        
        if (!parent || parent.type !== 'folder') return;
        
        const language = getLanguageFromName(name);
        const newFile: FileNode = {
          id,
          name,
          path: `${parent.path}/${name}`,
          type: 'file',
          content,
          language,
          isDirty: true,
          parentId,
          lastModified: Date.now(),
          size: content.length
        };
        
        set(state => ({
          files: {
            ...state.files,
            [id]: newFile,
            [parentId]: {
              ...parent,
              children: [...(parent.children || []), id]
            }
          }
        }));
      },
      
      // Create folder
      createFolder: (parentId, name) => {
        const { files } = get();
        const id = `${Date.now()}-${name}`;
        const parent = files[parentId];
        
        if (!parent || parent.type !== 'folder') return;
        
        const newFolder: FileNode = {
          id,
          name,
          path: `${parent.path}/${name}`,
          type: 'folder',
          children: [],
          parentId,
          lastModified: Date.now()
        };
        
        set(state => ({
          files: {
            ...state.files,
            [id]: newFolder,
            [parentId]: {
              ...parent,
              children: [...(parent.children || []), id]
            }
          }
        }));
      },
      
      // Delete file or folder
      deleteFile: (id) => {
        const { files } = get();
        const file = files[id];
        if (!file) return;
        
        // Recursively delete children if it's a folder
        const deleteRecursive = (nodeId: string, currentFiles: Record<string, FileNode>): Record<string, FileNode> => {
          const node = currentFiles[nodeId];
          if (!node) return currentFiles;
          
          let newFiles = { ...currentFiles };
          
          if (node.type === 'folder' && node.children) {
            node.children.forEach(childId => {
              newFiles = deleteRecursive(childId, newFiles);
            });
          }
          
          delete newFiles[nodeId];
          return newFiles;
        };
        
        let newFiles = deleteRecursive(id, files);
        
        // Remove from parent's children
        if (file.parentId) {
          const parent = newFiles[file.parentId];
          if (parent) {
            newFiles[file.parentId] = {
              ...parent,
              children: parent.children?.filter(childId => childId !== id) || []
            };
          }
        }
        
        set({ files: newFiles });
      },
      
      // Rename file or folder
      renameFile: (id, newName) => {
        const { files } = get();
        const file = files[id];
        if (!file) return;
        
        const oldPath = file.path;
        const newPath = `${file.path.split('/').slice(0, -1).join('/')}/${newName}`;
        
        set(state => ({
          files: {
            ...state.files,
            [id]: {
              ...file,
              name: newName,
              path: newPath,
              lastModified: Date.now(),
              isDirty: true
            }
          }
        }));
      },
      
      // Move file or folder
      moveFile: (id, newParentId) => {
        const { files } = get();
        const file = files[id];
        const newParent = files[newParentId];
        
        if (!file || !newParent || newParent.type !== 'folder') return;
        
        // Remove from old parent
        let newFiles = { ...files };
        if (file.parentId) {
          const oldParent = newFiles[file.parentId];
          if (oldParent) {
            newFiles[file.parentId] = {
              ...oldParent,
              children: oldParent.children?.filter(childId => childId !== id) || []
            };
          }
        }
        
        // Add to new parent
        newFiles = {
          ...newFiles,
          [newParentId]: {
            ...newParent,
            children: [...(newParent.children || []), id]
          },
          [id]: {
            ...file,
            parentId: newParentId,
            path: `${newParent.path}/${file.name}`,
            lastModified: Date.now()
          }
        };
        
        set({ files: newFiles });
      },
      
      // Update file content
      updateFileContent: (id, content) => {
        const { files } = get();
        const file = files[id];
        
        if (!file || file.type !== 'file') return;
        
        set(state => ({
          files: {
            ...state.files,
            [id]: {
              ...file,
              content,
              isDirty: true,
              lastModified: Date.now(),
              size: content.length
            }
          }
        }));
      },
      
      // Folder operations
      toggleFolder: (id) => {
        const { expandedFolders } = get();
        const newExpanded = new Set(expandedFolders);
        
        if (newExpanded.has(id)) {
          newExpanded.delete(id);
        } else {
          newExpanded.add(id);
        }
        
        set({ expandedFolders: newExpanded });
      },
      
      expandFolder: (id) => {
        const { expandedFolders } = get();
        const newExpanded = new Set(expandedFolders);
        newExpanded.add(id);
        set({ expandedFolders: newExpanded });
      },
      
      collapseFolder: (id) => {
        const { expandedFolders } = get();
        const newExpanded = new Set(expandedFolders);
        newExpanded.delete(id);
        set({ expandedFolders: newExpanded });
      },
      
      expandAll: () => {
        const { files } = get();
        const allFolderIds = Object.values(files)
          .filter(file => file.type === 'folder')
          .map(file => file.id);
        
        set({ expandedFolders: new Set(allFolderIds) });
      },
      
      collapseAll: () => {
        set({ expandedFolders: new Set(['root']) });
      },
      
      // Selection operations
      selectFile: (id) => {
        const { selectedFiles } = get();
        set({ selectedFiles: new Set([id]) });
      },
      
      selectMultipleFiles: (ids) => {
        set({ selectedFiles: new Set(ids) });
      },
      
      clearSelection: () => {
        set({ selectedFiles: new Set() });
      },
      
      // Workspace operations
      setWorkspaceRoot: (root) => {
        set({ workspaceRoot: root, workspaceName: root });
      },
      
      // File System Access API integration (placeholder implementations)
      syncWithFileSystem: async () => {
        // Implementation for syncing with actual File System Access API
        console.log('Sync with file system not yet implemented');
      },
      
      watchFileSystem: () => {
        // Implementation for watching file changes
        console.log('File system watching not yet implemented');
      }
    }),
    {
      name: 'lumina-filesystem',
      partialize: (state) => ({
        workspaceRoot: state.workspaceRoot,
        workspaceName: state.workspaceName,
        expandedFolders: Array.from(state.expandedFolders)
      })
    }
  )
);

// Helper function to detect language from file name
function getLanguageFromName(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'json': 'json',
    'md': 'markdown',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    'html': 'html',
    'htm': 'html',
    'xml': 'xml',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'h': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'fish': 'shell',
    'sql': 'sql',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'dockerfile': 'dockerfile',
    'gitignore': 'gitignore',
    'eslintrc': 'javascript',
    'prettierrc': 'javascript',
    'tsconfig': 'json',
    'package': 'json',
    'lock': 'text',
    'txt': 'text',
    'log': 'text'
  };
  
  return languageMap[ext || ''] || 'text';
}
