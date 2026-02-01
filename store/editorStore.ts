import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditorFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  isOpen: boolean;
  lastModified: number;
  encoding: string;
  lineEnding: 'LF' | 'CRLF' | 'CR';
  indentSize: number;
  indentUsingSpaces: boolean;
  trimWhitespace: boolean;
}

export interface EditorState {
  // File management
  files: Record<string, EditorFile>;
  openTabs: string[];
  activeTabId: string | null;
  recentFiles: string[];
  
  // Editor state
  currentLine: number;
  currentColumn: number;
  selection: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  } | null;
  
  // Scrolling state
  scrollTop: number;
  scrollLeft: number;
  viewportHeight: number;
  viewportWidth: number;
  
  // Editor instance reference
  editorInstance: any | null;
  
  // Editor settings
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
  bracketPairColorization: boolean;
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  smoothScrolling: boolean;
  
  // File operations
  addFile: (file: EditorFile) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  closeFileById: (id: string) => void;
  setActiveTab: (id: string) => void;
  
  // Editor operations
  setCursorPosition: (line: number, column: number) => void;
  setSelection: (start: { line: number; column: number }, end: { line: number; column: number }) => void;
  clearSelection: () => void;
  
  // Scrolling operations
  setScrollPosition: (scrollTop: number, scrollLeft: number) => void;
  scrollToLine: (lineNumber: number, direction?: 'top' | 'center' | 'bottom') => void;
  revealLine: (lineNumber: number) => void;
  setViewportSize: (height: number, width: number) => void;
  
  // Editor instance management
  setEditorInstance: (editor: any) => void;
  clearEditorInstance: () => void;
  
  // Advanced editor operations
  copySelection: () => void;
  cutSelection: () => void;
  pasteText: () => void;
  selectAll: () => void;
  undo: () => void;
  redo: () => void;
  formatDocument: () => void;
  toggleComment: () => void;
  indentLines: () => void;
  outdentLines: () => void;
  
  // Settings operations
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setLineHeight: (height: number) => void;
  setWordWrap: (wrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded') => void;
  setMinimap: (enabled: boolean) => void;
  setLineNumbers: (numbers: 'on' | 'off' | 'relative' | 'interval') => void;
  setRenderWhitespace: (option: 'none' | 'boundary' | 'selection' | 'trailing' | 'all') => void;
  setBracketPairColorization: (enabled: boolean) => void;
  setCursorBlinking: (blinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid') => void;
  setSmoothScrolling: (enabled: boolean) => void;
  
  // File persistence
  saveFiles: () => void;
  loadFiles: () => void;
  
  // Dirty state management
  markFileDirty: (id: string) => void;
  markFileClean: (id: string) => void;
  hasDirtyFiles: () => boolean;
  getDirtyFiles: () => EditorFile[];
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial state
      files: {
        'welcome': {
          id: 'welcome',
          name: 'Welcome.md',
          path: '/Welcome.md',
          content: `# Welcome to LUMINA STUDIO

## Professional Web-Based Code Editor

LUMINA STUDIO is a modern, professional web-based code editor built with React 19, TypeScript, and Monaco Editor. It provides VS Code-like functionality with a minimalist monochromatic design.

### Features

- **File System Management**: Full folder-based workspace support
- **Multi-Tab Editor**: Professional tab management with dirty state tracking
- **Command Palette**: VS Code-style command system with keybindings
- **Integrated Terminal**: Multi-session terminal support
- **Search & Replace**: Global search across workspace
- **Theme Support**: Dark/light themes with customizable appearance
- **Keyboard Shortcuts**: Comprehensive keybinding system
- **Real-time Collaboration**: Built-in collaboration features

### Getting Started

1. **Open a Folder**: Use \`File: Open Folder...\` (Ctrl+K Ctrl+O) to open your workspace
2. **Create Files**: Right-click in the file explorer to create new files
3. **Command Palette**: Press Ctrl+Shift+P to access all commands
4. **Terminal**: Press Ctrl+\` to open the integrated terminal
5. **Search**: Press Ctrl+Shift+F to search across all files

### Keyboard Shortcuts

- \`Ctrl+N\` - New File
- \`Ctrl+S\` - Save File
- \`Ctrl+P\` - Quick Open
- \`Ctrl+Shift+P\` - Command Palette
- \`Ctrl+B\` - Toggle Sidebar
- \`Ctrl+\` - Toggle Terminal
- \`Ctrl+G\` - Go to Line

### Architecture

Built with modern web technologies:
- **React 19** with TypeScript
- **Zustand** for state management
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **Lucide React** for icons

---

Welcome to the future of web-based development! 🚀`,
          language: 'markdown',
          isDirty: false,
          isOpen: true,
          lastModified: Date.now(),
          encoding: 'utf-8',
          lineEnding: 'LF',
          indentSize: 4,
          indentUsingSpaces: true,
          trimWhitespace: true
        }
      },
      openTabs: ['welcome'],
      activeTabId: 'welcome',
      recentFiles: [],
      
      currentLine: 1,
      currentColumn: 1,
      selection: null,
      
      // Scrolling state
      scrollTop: 0,
      scrollLeft: 0,
      viewportHeight: 600,
      viewportWidth: 800,
      
      // Editor instance
      editorInstance: null,
      
      fontSize: 14,
      fontFamily: "'IBM Plex Mono', monospace",
      lineHeight: 1.6,
      wordWrap: 'on',
      minimap: false,
      lineNumbers: 'on',
      renderWhitespace: 'none',
      bracketPairColorization: true,
      cursorBlinking: 'blink',
      smoothScrolling: true,
      
      // File operations
      addFile: (file) => {
        set(state => ({
          files: {
            ...state.files,
            [file.id]: file
          }
        }));
      },
      
      updateFile: (id, content) => {
        set(state => ({
          files: {
            ...state.files,
            [id]: {
              ...state.files[id],
              content,
              isDirty: true,
              lastModified: Date.now()
            }
          }
        }));
      },
      
      deleteFile: (id) => {
        const { files, openTabs, activeTabId } = get();
        
        // Remove from files
        const newFiles = { ...files };
        delete newFiles[id];
        
        // Remove from open tabs
        const newOpenTabs = openTabs.filter(tabId => tabId !== id);
        
        // Set new active tab if needed
        let newActiveTabId = activeTabId;
        if (activeTabId === id) {
          newActiveTabId = newOpenTabs.length > 0 ? newOpenTabs[0] : null;
        }
        
        set({
          files: newFiles,
          openTabs: newOpenTabs,
          activeTabId: newActiveTabId
        });
      },
      
      openFile: (id) => {
        const { files, openTabs } = get();
        const file = files[id];
        
        if (!file) return;
        
        set(state => ({
          files: {
            ...state.files,
            [id]: { ...file, isOpen: true }
          },
          openTabs: state.openTabs.includes(id) ? state.openTabs : [...state.openTabs, id],
          activeTabId: id,
          recentFiles: [id, ...state.recentFiles.filter(fileId => fileId !== id)].slice(0, 20)
        }));
      },
      
      closeFile: (id) => {
        const { openTabs, activeTabId } = get();
        
        const newOpenTabs = openTabs.filter(tabId => tabId !== id);
        let newActiveTabId = activeTabId;
        
        if (activeTabId === id) {
          const currentIndex = openTabs.indexOf(id);
          newActiveTabId = currentIndex > 0 ? openTabs[currentIndex - 1] : 
                           newOpenTabs.length > 0 ? newOpenTabs[0] : null;
        }
        
        set({
          openTabs: newOpenTabs,
          activeTabId: newActiveTabId
        });
      },
      
      closeFileById: (id) => {
        get().closeFile(id);
      },
      
      setActiveTab: (id) => {
        const { openTabs } = get();
        if (openTabs.includes(id)) {
          set({ activeTabId: id });
        }
      },
      
      // Editor operations
      setCursorPosition: (line, column) => {
        set({ currentLine: line, currentColumn: column });
      },
      
      setSelection: (start, end) => {
        set({ selection: { start, end } });
      },
      
      clearSelection: () => {
        set({ selection: null });
      },
      
      // Scrolling operations
      setScrollPosition: (scrollTop, scrollLeft) => {
        set({ scrollTop, scrollLeft });
      },
      
      scrollToLine: (lineNumber, direction = 'center') => {
        const { editorInstance } = get();
        if (editorInstance) {
          switch (direction) {
            case 'top':
              editorInstance.revealLineAtTop(lineNumber);
              break;
            case 'bottom':
              editorInstance.revealLineAtBottom(lineNumber);
              break;
            default:
              editorInstance.revealLineInCenter(lineNumber);
          }
        }
      },
      
      revealLine: (lineNumber) => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.revealLine(lineNumber);
        }
      },
      
      setViewportSize: (height, width) => {
        set({ viewportHeight: height, viewportWidth: width });
      },
      
      // Editor instance management
      setEditorInstance: (editor) => {
        set({ editorInstance: editor });
      },
      
      clearEditorInstance: () => {
        set({ editorInstance: null });
      },
      
      // Advanced editor operations
      copySelection: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.clipboardCopyAction').run();
        }
      },
      
      cutSelection: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.clipboardCutAction').run();
        }
      },
      
      pasteText: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.clipboardPasteAction').run();
        }
      },
      
      selectAll: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.selectAll').run();
        }
      },
      
      undo: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('undo').run();
        }
      },
      
      redo: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('redo').run();
        }
      },
      
      formatDocument: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.formatDocument').run();
        }
      },
      
      toggleComment: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.commentLine').run();
        }
      },
      
      indentLines: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.indentLines').run();
        }
      },
      
      outdentLines: () => {
        const { editorInstance } = get();
        if (editorInstance) {
          editorInstance.getAction('editor.action.outdentLines').run();
        }
      },
      
      // Settings operations
      setFontSize: (size) => {
        set({ fontSize: Math.max(10, Math.min(24, size)) });
      },
      
      setFontFamily: (family) => {
        set({ fontFamily: family });
      },
      
      setLineHeight: (height) => {
        set({ lineHeight: Math.max(1.0, Math.min(3.0, height)) });
      },
      
      setWordWrap: (wrap) => {
        set({ wordWrap: wrap });
      },
      
      setMinimap: (enabled) => {
        set({ minimap: enabled });
      },
      
      setLineNumbers: (numbers) => {
        set({ lineNumbers: numbers });
      },
      
      setRenderWhitespace: (option) => {
        set({ renderWhitespace: option });
      },
      
      setBracketPairColorization: (enabled) => {
        set({ bracketPairColorization: enabled });
      },
      
      setCursorBlinking: (blinking) => {
        set({ cursorBlinking: blinking });
      },
      
      setSmoothScrolling: (enabled) => {
        set({ smoothScrolling: enabled });
      },
      
      // File persistence
      saveFiles: () => {
        const { files } = get();
        const filesData = Object.fromEntries(
          Object.entries(files).map(([id, file]) => [
            id,
            {
              ...file,
              isOpen: false // Don't persist open state
            }
          ])
        );
        localStorage.setItem('lumina-files', JSON.stringify(filesData));
      },
      
      loadFiles: () => {
        try {
          const savedFiles = localStorage.getItem('lumina-files');
          if (savedFiles) {
            const filesData = JSON.parse(savedFiles);
            set({ files: filesData });
          }
        } catch (error) {
          console.error('Failed to load files:', error);
        }
      },
      
      // Dirty state management
      markFileDirty: (id) => {
        set(state => ({
          files: {
            ...state.files,
            [id]: {
              ...state.files[id],
              isDirty: true,
              lastModified: Date.now()
            }
          }
        }));
      },
      
      markFileClean: (id) => {
        set(state => ({
          files: {
            ...state.files,
            [id]: {
              ...state.files[id],
              isDirty: false
            }
          }
        }));
      },
      
      hasDirtyFiles: () => {
        const { files } = get();
        return Object.values(files).some(file => file.isDirty);
      },
      
      getDirtyFiles: () => {
        const { files } = get();
        return Object.values(files).filter(file => file.isDirty);
      }
    }),
    {
      name: 'lumina-editor',
      partialize: (state) => ({
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        lineHeight: state.lineHeight,
        wordWrap: state.wordWrap,
        minimap: state.minimap,
        lineNumbers: state.lineNumbers,
        renderWhitespace: state.renderWhitespace,
        bracketPairColorization: state.bracketPairColorization,
        cursorBlinking: state.cursorBlinking,
        smoothScrolling: state.smoothScrolling,
        recentFiles: state.recentFiles
      })
    }
  )
);
