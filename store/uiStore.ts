import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  // Layout state
  sidebarVisible: boolean;
  sidebarWidth: number;
  activityBarVisible: boolean;
  statusBarVisible: boolean;
  panelVisible: boolean;
  panelPosition: 'bottom' | 'right';
  panelHeight: number;
  panelWidth: number;

  // Sidebar view state
  activeSidebarView: 'explorer' | 'search' | 'source-control' | 'debug' | 'extensions' | 'ai_chat' | 'tools';

  // Editor layout
  editorGroupLayout: 'single' | 'horizontal' | 'vertical';
  editorGroups: string[];
  activeEditorGroup: string;

  // Panel state
  activePanel: 'terminal' | 'output' | 'debugConsole' | 'problems';

  // Modal/Dialog states (VS Code-style)
  commandPaletteOpen: boolean;
  quickOpenOpen: boolean;
  searchPanelOpen: boolean;
  goToLineOpen: boolean;
  keyboardShortcutsOpen: boolean;
  settingsPanelOpen: boolean;

  // Notifications
  notifications: Notification[];
  notificationsVisible: boolean;

  // Modals and dialogs
  openDialogs: Record<string, boolean>;
  dialogData: Record<string, any>;

  // Theme and appearance
  theme: 'dark' | 'light';
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';

  // Layout operations
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  toggleActivityBar: () => void;
  toggleStatusBar: () => void;
  togglePanel: () => void;
  setPanelPosition: (position: 'bottom' | 'right') => void;
  setPanelHeight: (height: number) => void;
  setPanelWidth: (width: number) => void;
  setActivePanel: (panel: 'terminal' | 'output' | 'debugConsole' | 'problems') => void;
  setActiveSidebarView: (view: 'explorer' | 'search' | 'source-control' | 'debug' | 'extensions' | 'ai_chat' | 'tools') => void;

  // Modal operations (VS Code-style)
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleQuickOpen: () => void;
  openQuickOpen: () => void;
  closeQuickOpen: () => void;
  toggleSearchPanel: () => void;
  openSearchPanel: () => void;
  closeSearchPanel: () => void;
  toggleGoToLine: () => void;
  openGoToLine: () => void;
  closeGoToLine: () => void;
  toggleKeyboardShortcuts: () => void;
  openKeyboardShortcuts: () => void;
  closeKeyboardShortcuts: () => void;
  toggleSettingsPanel: () => void;
  openSettingsPanel: () => void;
  closeSettingsPanel: () => void;

  // Editor group operations
  splitEditorHorizontal: () => void;
  splitEditorVertical: () => void;
  closeEditorGroup: (groupId: string) => void;
  setActiveEditorGroup: (groupId: string) => void;

  // Notification operations
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleNotifications: () => void;

  // Dialog operations
  openDialog: (dialogId: string, data?: any) => void;
  closeDialog: (dialogId: string) => void;
  setDialogData: (dialogId: string, data: any) => void;

  // Theme operations
  setTheme: (theme: 'dark' | 'light') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setLineHeight: (height: number) => void;
  setWordWrap: (wrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded') => void;
  setMinimap: (enabled: boolean) => void;
  setLineNumbers: (numbers: 'on' | 'off' | 'relative' | 'interval') => void;
  setRenderWhitespace: (option: 'none' | 'boundary' | 'selection' | 'trailing' | 'all') => void;

  // Layout persistence
  saveLayout: () => void;
  loadLayout: () => void;
  resetLayout: () => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  actions?: NotificationAction[];
  duration?: number; // Auto-dismiss after this many ms
}

export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarVisible: true,
      sidebarWidth: 300,
      activityBarVisible: true,
      statusBarVisible: true,
      panelVisible: false,
      panelPosition: 'bottom',
      panelHeight: 300,
      panelWidth: 400,

      activeSidebarView: 'explorer',

      editorGroupLayout: 'single',
      editorGroups: ['group-1'],
      activeEditorGroup: 'group-1',

      activePanel: 'terminal',

      // Modal states
      commandPaletteOpen: false,
      quickOpenOpen: false,
      searchPanelOpen: false,
      goToLineOpen: false,
      keyboardShortcutsOpen: false,
      settingsPanelOpen: false,

      notifications: [],
      notificationsVisible: true,

      openDialogs: {},
      dialogData: {},

      theme: 'dark',
      fontSize: 14,
      fontFamily: "'IBM Plex Mono', monospace",
      lineHeight: 1.6,
      wordWrap: 'on',
      minimap: false,
      lineNumbers: 'on',
      renderWhitespace: 'none',

      // Layout operations
      toggleSidebar: () => {
        set(state => ({ sidebarVisible: !state.sidebarVisible }));
      },

      setSidebarWidth: (width) => {
        set({ sidebarWidth: Math.max(200, Math.min(800, width)) });
      },

      toggleActivityBar: () => {
        set(state => ({ activityBarVisible: !state.activityBarVisible }));
      },

      toggleStatusBar: () => {
        set(state => ({ statusBarVisible: !state.statusBarVisible }));
      },

      togglePanel: () => {
        set(state => ({ panelVisible: !state.panelVisible }));
      },

      setPanelPosition: (position) => {
        set({ panelPosition: position });
      },

      setPanelHeight: (height) => {
        set({ panelHeight: Math.max(100, Math.min(600, height)) });
      },

      setPanelWidth: (width) => {
        set({ panelWidth: Math.max(200, Math.min(800, width)) });
      },

      setActivePanel: (panel) => {
        set({ activePanel: panel, panelVisible: true });
      },

      setActiveSidebarView: (view) => {
        set({ activeSidebarView: view, sidebarVisible: true });
      },

      // Modal operations
      toggleCommandPalette: () => {
        set(state => ({ commandPaletteOpen: !state.commandPaletteOpen }));
      },

      openCommandPalette: () => {
        set({ commandPaletteOpen: true });
      },

      closeCommandPalette: () => {
        set({ commandPaletteOpen: false });
      },

      toggleQuickOpen: () => {
        set(state => ({ quickOpenOpen: !state.quickOpenOpen }));
      },

      openQuickOpen: () => {
        set({ quickOpenOpen: true });
      },

      closeQuickOpen: () => {
        set({ quickOpenOpen: false });
      },

      toggleSearchPanel: () => {
        set(state => ({ searchPanelOpen: !state.searchPanelOpen }));
      },

      openSearchPanel: () => {
        set({ searchPanelOpen: true });
      },

      closeSearchPanel: () => {
        set({ searchPanelOpen: false });
      },

      toggleGoToLine: () => {
        set(state => ({ goToLineOpen: !state.goToLineOpen }));
      },

      openGoToLine: () => {
        set({ goToLineOpen: true });
      },

      closeGoToLine: () => {
        set({ goToLineOpen: false });
      },

      toggleKeyboardShortcuts: () => {
        set(state => ({ keyboardShortcutsOpen: !state.keyboardShortcutsOpen }));
      },

      openKeyboardShortcuts: () => {
        set({ keyboardShortcutsOpen: true });
      },

      closeKeyboardShortcuts: () => {
        set({ keyboardShortcutsOpen: false });
      },

      toggleSettingsPanel: () => {
        set(state => ({ settingsPanelOpen: !state.settingsPanelOpen }));
      },

      openSettingsPanel: () => {
        set({ settingsPanelOpen: true });
      },

      closeSettingsPanel: () => {
        set({ settingsPanelOpen: false });
      },

      // Editor group operations
      splitEditorHorizontal: () => {
        const { editorGroups, activeEditorGroup } = get();
        const newGroupId = `group-${Date.now()}`;
        const newGroups = [...editorGroups, newGroupId];

        set({
          editorGroupLayout: 'horizontal',
          editorGroups: newGroups,
          activeEditorGroup: newGroupId
        });
      },

      splitEditorVertical: () => {
        const { editorGroups, activeEditorGroup } = get();
        const newGroupId = `group-${Date.now()}`;
        const newGroups = [...editorGroups, newGroupId];

        set({
          editorGroupLayout: 'vertical',
          editorGroups: newGroups,
          activeEditorGroup: newGroupId
        });
      },

      closeEditorGroup: (groupId) => {
        const { editorGroups, activeEditorGroup } = get();

        if (editorGroups.length <= 1) return; // Don't close the last group

        const newGroups = editorGroups.filter(id => id !== groupId);
        let newActiveGroup = activeEditorGroup;

        // If we closed the active group, activate another one
        if (activeEditorGroup === groupId) {
          newActiveGroup = newGroups[0] || 'group-1';
        }

        // If we only have one group left, reset to single layout
        if (newGroups.length === 1) {
          set({
            editorGroupLayout: 'single',
            editorGroups: newGroups,
            activeEditorGroup: newActiveGroup
          });
        } else {
          set({
            editorGroups: newGroups,
            activeEditorGroup: newActiveGroup
          });
        }
      },

      setActiveEditorGroup: (groupId) => {
        const { editorGroups } = get();
        if (editorGroups.includes(groupId)) {
          set({ activeEditorGroup: groupId });
        }
      },

      // Notification operations
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now()
        };

        set(state => ({
          notifications: [...state.notifications, newNotification]
        }));

        // Auto-dismiss if duration is specified
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },

      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      toggleNotifications: () => {
        set(state => ({ notificationsVisible: !state.notificationsVisible }));
      },

      // Dialog operations
      openDialog: (dialogId, data) => {
        set(state => ({
          openDialogs: { ...state.openDialogs, [dialogId]: true },
          dialogData: { ...state.dialogData, [dialogId]: data }
        }));
      },

      closeDialog: (dialogId) => {
        set(state => ({
          openDialogs: { ...state.openDialogs, [dialogId]: false },
          dialogData: { ...state.dialogData, [dialogId]: undefined }
        }));
      },

      setDialogData: (dialogId, data) => {
        set(state => ({
          dialogData: { ...state.dialogData, [dialogId]: data }
        }));
      },

      // Theme operations
      setTheme: (theme) => {
        set({ theme });
      },

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

      // Layout persistence
      saveLayout: () => {
        const state = get();
        const layoutData = {
          sidebarVisible: state.sidebarVisible,
          sidebarWidth: state.sidebarWidth,
          activityBarVisible: state.activityBarVisible,
          statusBarVisible: state.statusBarVisible,
          panelVisible: state.panelVisible,
          panelPosition: state.panelPosition,
          panelHeight: state.panelHeight,
          panelWidth: state.panelWidth,
          activePanel: state.activePanel,
          theme: state.theme,
          fontSize: state.fontSize,
          fontFamily: state.fontFamily,
          lineHeight: state.lineHeight,
          wordWrap: state.wordWrap,
          minimap: state.minimap,
          lineNumbers: state.lineNumbers,
          renderWhitespace: state.renderWhitespace
        };

        localStorage.setItem('lumina-layout', JSON.stringify(layoutData));
      },

      loadLayout: () => {
        try {
          const savedLayout = localStorage.getItem('lumina-layout');
          if (savedLayout) {
            const layoutData = JSON.parse(savedLayout);
            set(layoutData);
          }
        } catch (error) {
          console.error('Failed to load layout:', error);
        }
      },

      resetLayout: () => {
        set({
          sidebarVisible: true,
          sidebarWidth: 300,
          activityBarVisible: true,
          statusBarVisible: true,
          panelVisible: false,
          panelPosition: 'bottom',
          panelHeight: 300,
          panelWidth: 400,
          activePanel: 'terminal',
          theme: 'dark',
          fontSize: 14,
          fontFamily: "'IBM Plex Mono', monospace",
          lineHeight: 1.6,
          wordWrap: 'on',
          minimap: false,
          lineNumbers: 'on',
          renderWhitespace: 'none'
        });
      }
    }),
    {
      name: 'lumina-ui',
      partialize: (state) => ({
        sidebarVisible: state.sidebarVisible,
        sidebarWidth: state.sidebarWidth,
        activityBarVisible: state.activityBarVisible,
        statusBarVisible: state.statusBarVisible,
        panelVisible: state.panelVisible,
        panelPosition: state.panelPosition,
        panelHeight: state.panelHeight,
        panelWidth: state.panelWidth,
        activePanel: state.activePanel,
        theme: state.theme,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        lineHeight: state.lineHeight,
        wordWrap: state.wordWrap,
        minimap: state.minimap,
        lineNumbers: state.lineNumbers,
        renderWhitespace: state.renderWhitespace
      })
    }
  )
);

// Helper functions for common UI operations
export const uiHelpers = {
  // Show success notification
  showSuccess: (title: string, message: string, duration = 3000) => {
    const store = useUIStore.getState();
    store.addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  },

  // Show error notification
  showError: (title: string, message: string, duration = 5000) => {
    const store = useUIStore.getState();
    store.addNotification({
      type: 'error',
      title,
      message,
      duration
    });
  },

  // Show warning notification
  showWarning: (title: string, message: string, duration = 4000) => {
    const store = useUIStore.getState();
    store.addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  },

  // Show info notification
  showInfo: (title: string, message: string, duration = 3000) => {
    const store = useUIStore.getState();
    store.addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  },

  // Show confirmation dialog
  showConfirmation: (title: string, message: string, onConfirm: () => void) => {
    const store = useUIStore.getState();
    store.openDialog('confirmation', { title, message, onConfirm });
  },

  // Show input dialog
  showInputDialog: (title: string, placeholder: string, defaultValue: string, onSubmit: (value: string) => void) => {
    const store = useUIStore.getState();
    store.openDialog('input', { title, placeholder, defaultValue, onSubmit });
  }
};
