// Store index - Centralized store exports for LUMINA STUDIO

// Import store hooks
import { useEditorStore } from './editorStore';
import { useFileSystemStore } from './fileSystemStore';
import { useTerminalStore } from './terminalStore';
import { useCommandStore, BUILTIN_COMMANDS } from './commandStore';
import { useUIStore } from './uiStore';

// Core stores
export { useEditorStore, type EditorFile, type EditorState } from './editorStore';
export { useFileSystemStore, type FileNode, type FileSystemState } from './fileSystemStore';
export { useTerminalStore, type TerminalSession, type TerminalState } from './terminalStore';
export { useCommandStore, type Command, type CommandPaletteState, createVSCodeCommand, BUILTIN_COMMANDS } from './commandStore';
export { useUIStore, type Notification, type NotificationAction, type UIState, uiHelpers } from './uiStore';

// Store initialization utilities
export const initializeStores = async () => {
  // Initialize file system support check
  const fileSystemStore = useFileSystemStore.getState();
  await fileSystemStore.requestFileSystemAccess();
  
  // Initialize terminal support
  const terminalStore = useTerminalStore.getState();
  await terminalStore.initializeXTerm();
  
  // Load saved layout
  const uiStore = useUIStore.getState();
  uiStore.loadLayout();
  
  // Load saved files
  const editorStore = useEditorStore.getState();
  editorStore.loadFiles();
  
  // Register built-in commands
  const commandStore = useCommandStore.getState();
  BUILTIN_COMMANDS.forEach(command => {
    commandStore.registerCommand(command);
  });
  
  console.log('✅ LUMINA STUDIO stores initialized');
};

// Store hooks for convenience
export const useStores = () => ({
  editor: useEditorStore(),
  fileSystem: useFileSystemStore(),
  terminal: useTerminalStore(),
  command: useCommandStore(),
  ui: useUIStore()
});

// Store state selectors for performance optimization
export const useEditorState = () => useEditorStore((state) => state);
export const useFileSystemState = () => useFileSystemStore((state) => state);
export const useTerminalState = () => useTerminalStore((state) => state);
export const useCommandState = () => useCommandStore((state) => state);
export const useUIState = () => useUIStore((state) => state);

// Common selectors
export const useActiveFile = () => useEditorStore((state) => 
  state.activeTabId ? state.files[state.activeTabId] : null
);

export const useOpenFiles = () => useEditorStore((state) => 
  state.openTabs.map(id => state.files[id]).filter(Boolean)
);

export const useWorkspaceFiles = () => {
  const fileSystemStore = useFileSystemStore();
  return Object.values(fileSystemStore.files).filter((file: any) => file.type === 'file');
};

export const useWorkspaceFolders = () => {
  const fileSystemStore = useFileSystemStore();
  return Object.values(fileSystemStore.files).filter((file: any) => file.type === 'folder');
};

export const useActiveTerminalSession = () => useTerminalStore((state) => 
  state.activeSessionId ? state.sessions[state.activeSessionId] : null
);

export const useTerminalSessions = () => useTerminalStore((state) => 
  Object.values(state.sessions)
);

export const useCommandPaletteResults = () => useCommandStore((state) => 
  state.searchResults
);

export const useNotifications = () => useUIStore((state) => 
  state.notifications
);

export const useOpenDialogs = () => useUIStore((state) => 
  state.openDialogs
);

// Store actions for convenience
export const useEditorActions = () => useEditorStore((state) => ({
  addFile: state.addFile,
  updateFile: state.updateFile,
  deleteFile: state.deleteFile,
  openFile: state.openFile,
  closeFile: state.closeFile,
  setActiveTab: state.setActiveTab,
  setCursorPosition: state.setCursorPosition,
  setSelection: state.setSelection,
  clearSelection: state.clearSelection,
  markFileDirty: state.markFileDirty,
  markFileClean: state.markFileClean,
  saveFiles: state.saveFiles,
  loadFiles: state.loadFiles
}));

export const useFileSystemActions = () => useFileSystemStore((state) => ({
  createFile: state.createFile,
  createFolder: state.createFolder,
  deleteFile: state.deleteFile,
  renameFile: state.renameFile,
  moveFile: state.moveFile,
  updateFileContent: state.updateFileContent,
  toggleFolder: state.toggleFolder,
  expandFolder: state.expandFolder,
  collapseFolder: state.collapseFolder,
  expandAll: state.expandAll,
  collapseAll: state.collapseAll,
  selectFile: state.selectFile,
  selectMultipleFiles: state.selectMultipleFiles,
  clearSelection: state.clearSelection,
  setWorkspaceRoot: state.setWorkspaceRoot,
  loadWorkspace: state.loadWorkspace,
  saveWorkspace: state.saveWorkspace,
  requestFileSystemAccess: state.requestFileSystemAccess,
  syncWithFileSystem: state.syncWithFileSystem,
  watchFileSystem: state.watchFileSystem
}));

export const useTerminalActions = () => useTerminalStore((state) => ({
  createSession: state.createSession,
  deleteSession: state.deleteSession,
  setActiveSession: state.setActiveSession,
  setSessionFocused: state.setSessionFocused,
  renameSession: state.renameSession,
  toggleTerminal: state.toggleTerminal,
  setTerminalHeight: state.setTerminalHeight,
  clearSession: state.clearSession,
  clearAllSessions: state.clearAllSessions,
  executeCommand: state.executeCommand,
  addToHistory: state.addToHistory,
  setCurrentInput: state.setCurrentInput,
  setCursorPosition: state.setCursorPosition,
  startProcess: state.startProcess,
  endProcess: state.endProcess,
  killProcess: state.killProcess,
  setFontSize: state.setFontSize,
  setFontFamily: state.setFontFamily,
  setBackgroundColor: state.setBackgroundColor,
  setTextColor: state.setTextColor,
  setCursorColor: state.setCursorColor,
  initializeXTerm: state.initializeXTerm
}));

export const useCommandActions = () => useCommandStore((state) => ({
  toggleCommandPalette: state.toggleCommandPalette,
  openCommandPalette: state.openCommandPalette,
  closeCommandPalette: state.closeCommandPalette,
  setQuery: state.setQuery,
  setSelectedIndex: state.setSelectedIndex,
  executeSelectedCommand: state.executeSelectedCommand,
  executeCommand: state.executeCommand,
  registerCommand: state.registerCommand,
  unregisterCommand: state.unregisterCommand,
  updateCommand: state.updateCommand,
  searchCommands: state.searchCommands,
  filterByCategory: state.filterByCategory,
  clearFilters: state.clearFilters,
  addToRecentlyUsed: state.addToRecentlyUsed,
  clearRecentlyUsed: state.clearRecentlyUsed,
  handleKeybinding: state.handleKeybinding,
  registerKeybinding: state.registerKeybinding,
  unregisterKeybinding: state.unregisterKeybinding
}));

export const useUIActions = () => useUIStore((state) => ({
  toggleSidebar: state.toggleSidebar,
  setSidebarWidth: state.setSidebarWidth,
  toggleActivityBar: state.toggleActivityBar,
  toggleStatusBar: state.toggleStatusBar,
  togglePanel: state.togglePanel,
  setPanelPosition: state.setPanelPosition,
  setPanelHeight: state.setPanelHeight,
  setPanelWidth: state.setPanelWidth,
  setActivePanel: state.setActivePanel,
  setActiveSidebarView: state.setActiveSidebarView,
  toggleCommandPalette: state.toggleCommandPalette,
  openCommandPalette: state.openCommandPalette,
  closeCommandPalette: state.closeCommandPalette,
  toggleQuickOpen: state.toggleQuickOpen,
  openQuickOpen: state.openQuickOpen,
  closeQuickOpen: state.closeQuickOpen,
  toggleSearchPanel: state.toggleSearchPanel,
  openSearchPanel: state.openSearchPanel,
  closeSearchPanel: state.closeSearchPanel,
  toggleGoToLine: state.toggleGoToLine,
  openGoToLine: state.openGoToLine,
  closeGoToLine: state.closeGoToLine,
  toggleKeyboardShortcuts: state.toggleKeyboardShortcuts,
  openKeyboardShortcuts: state.openKeyboardShortcuts,
  closeKeyboardShortcuts: state.closeKeyboardShortcuts,
  toggleSettingsPanel: state.toggleSettingsPanel,
  openSettingsPanel: state.openSettingsPanel,
  closeSettingsPanel: state.closeSettingsPanel,
  splitEditorHorizontal: state.splitEditorHorizontal,
  splitEditorVertical: state.splitEditorVertical,
  closeEditorGroup: state.closeEditorGroup,
  setActiveEditorGroup: state.setActiveEditorGroup,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  toggleNotifications: state.toggleNotifications,
  openDialog: state.openDialog,
  closeDialog: state.closeDialog,
  setDialogData: state.setDialogData,
  setTheme: state.setTheme,
  setFontSize: state.setFontSize,
  setFontFamily: state.setFontFamily,
  setLineHeight: state.setLineHeight,
  setWordWrap: state.setWordWrap,
  setMinimap: state.setMinimap,
  setLineNumbers: state.setLineNumbers,
  setRenderWhitespace: state.setRenderWhitespace,
  saveLayout: state.saveLayout,
  loadLayout: state.loadLayout,
  resetLayout: state.resetLayout
}));
