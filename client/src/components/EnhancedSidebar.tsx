import { useEditorStore } from '@/store/editorStore';
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  X,
  Plus,
  MoreVertical,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createNewFile, validateFilename } from '@/lib/fileManager';

export default function EnhancedSidebar() {
  const { files, openTabs, activeTabId, openFile, closeFile, deleteFile, addFile } =
    useEditorStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [creatingFile, setCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    fileId: string;
    x: number;
    y: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingFile) {
      inputRef.current?.focus();
    }
  }, [creatingFile]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (fileId: string) => {
    openFile(fileId);
    setContextMenu(null);
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId);
    setContextMenu(null);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    if (!validateFilename(newFileName)) {
      alert('Invalid filename');
      return;
    }

    const newFile = createNewFile(newFileName);
    addFile(newFile);
    openFile(newFile.id);
    setNewFileName('');
    setCreatingFile(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFile();
    } else if (e.key === 'Escape') {
      setCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    fileId: string
  ) => {
    e.preventDefault();
    setContextMenu({
      fileId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="editor-sidebar flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Explorer</h2>
        <button
          onClick={() => setCreatingFile(true)}
          className="p-1 hover:bg-secondary rounded transition-colors"
          title="New file"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {creatingFile && (
          <div className="px-4 py-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              placeholder="filename.txt"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newFileName.trim()) {
                  setCreatingFile(false);
                }
              }}
              className="w-full px-2 py-1 bg-input text-foreground text-sm border border-border focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {files.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-xs">
            <p>No files</p>
            <p className="mt-2 text-xs">Click + to create a new file</p>
          </div>
        ) : (
          <div className="py-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`file-tree-item group flex items-center justify-between ${
                  activeTabId === file.id ? 'active' : ''
                }`}
                onClick={() => handleFileClick(file.id)}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <File size={14} className="mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {file.isDirty && (
                    <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary"
                    title="Delete file"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-card border border-border shadow-lg z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={() => {
              handleDeleteFile(contextMenu.fileId);
            }}
            className="w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setContextMenu(null)}
            className="w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <p>{files.length} file(s)</p>
      </div>
    </div>
  );
}
