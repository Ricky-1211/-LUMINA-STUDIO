import { create } from 'zustand';

export interface EditorFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  isOpen: boolean;
}

export interface EditorState {
  files: EditorFile[];
  openTabs: string[];
  activeTabId: string | null;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  searchOpen: boolean;
  goToLineOpen: boolean;
  keyboardShortcutsOpen: boolean;
  currentLine: number;
  currentColumn: number;

  // File operations
  addFile: (file: EditorFile) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  setActiveTab: (id: string) => void;

  // UI state
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  toggleSearch: () => void;
  toggleGoToLine: () => void;
  toggleKeyboardShortcuts: () => void;
  setCursorPosition: (line: number, column: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  files: [
    {
      id: 'welcome',
      name: 'Welcome.md',
      path: '/Welcome.md',
      content: `# Welcome to VS Code Clone

This is a modern, web-based code editor built with React and Monaco Editor.

## Features
- Syntax highlighting for multiple languages
- Multiple file tabs
- Search and replace
- Command palette
- Real-time code editing

## Getting Started
1. Open a file from the sidebar
2. Start editing your code
3. Use Ctrl+K Ctrl+P to open the command palette
4. Use Ctrl+F to search

Happy coding!`,
      language: 'markdown',
      isDirty: false,
      isOpen: true,
    },
  ],
  openTabs: ['welcome'],
  activeTabId: 'welcome',
  sidebarOpen: true,
  commandPaletteOpen: false,
  searchOpen: false,
  goToLineOpen: false,
  keyboardShortcutsOpen: false,
  currentLine: 1,
  currentColumn: 1,

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  updateFile: (id, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, content, isDirty: true } : file
      ),
    })),

  deleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
      openTabs: state.openTabs.filter((tabId) => tabId !== id),
      activeTabId:
        state.activeTabId === id
          ? state.openTabs.find((tabId) => tabId !== id) || null
          : state.activeTabId,
    })),

  openFile: (id) =>
    set((state) => ({
      openTabs: state.openTabs.includes(id)
        ? state.openTabs
        : [...state.openTabs, id],
      activeTabId: id,
    })),

  closeFile: (id) =>
    set((state) => {
      const newTabs = state.openTabs.filter((tabId) => tabId !== id);
      return {
        openTabs: newTabs,
        activeTabId:
          state.activeTabId === id
            ? newTabs[newTabs.length - 1] || null
            : state.activeTabId,
      };
    }),

  setActiveTab: (id) =>
    set(() => ({
      activeTabId: id,
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  toggleCommandPalette: () =>
    set((state) => ({
      commandPaletteOpen: !state.commandPaletteOpen,
    })),

  toggleSearch: () =>
    set((state) => ({
      searchOpen: !state.searchOpen,
    })),

  toggleGoToLine: () =>
    set((state) => ({
      goToLineOpen: !state.goToLineOpen,
    })),

  toggleKeyboardShortcuts: () =>
    set((state) => ({
      keyboardShortcutsOpen: !state.keyboardShortcutsOpen,
    })),

  setCursorPosition: (line, column) =>
    set(() => ({
      currentLine: line,
      currentColumn: column,
    })),
}));
