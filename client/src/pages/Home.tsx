import { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import Editor from '@/components/Editor';
import EnhancedSidebar from '@/components/EnhancedSidebar';
import Tabs from '@/components/Tabs';
import StatusBar from '@/components/StatusBar';
import CommandPalette from '@/components/CommandPalette';
import SearchPanel from '@/components/SearchPanel';
import GoToLineDialog from '@/components/GoToLineDialog';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import TopBar from '@/components/TopBar';
import Settings from '@/components/Settings';

export default function Home() {
  const {
    sidebarOpen,
    files,
    activeTabId,
    goToLineOpen,
    keyboardShortcutsOpen,
    toggleCommandPalette,
    toggleSearch,
    toggleGoToLine,
    toggleKeyboardShortcuts,
  } = useEditorStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const activeFile = files.find((f) => f.id === activeTabId);
  const maxLines = activeFile ? activeFile.content.split('\n').length : 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K Ctrl+P for command palette
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Ctrl+F for search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleSearch();
      }
      // Ctrl+G for go to line
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        toggleGoToLine();
      }
      // Ctrl+Shift+? for keyboard shortcuts
      if (e.ctrlKey && e.shiftKey && e.key === '?') {
        e.preventDefault();
        toggleKeyboardShortcuts();
      }
      // Ctrl+, for settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, toggleSearch, toggleGoToLine, toggleKeyboardShortcuts]);

  return (
    <div className="editor-container flex flex-col">
      {/* Top Bar */}
      <TopBar
        onSettingsClick={() => setSettingsOpen(true)}
        onHelpClick={() => setHelpOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && <EnhancedSidebar />}

        {/* Main Editor Area */}
        <div className="editor-main">
          {/* Tabs */}
          <Tabs />

          {/* Search Panel */}
          <SearchPanel />

          {/* Editor Content */}
          <div className="editor-content">
            <Editor />
          </div>

          {/* Status Bar */}
          <StatusBar />
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette />

      {/* Go to Line Dialog */}
      <GoToLineDialog
        isOpen={goToLineOpen}
        onClose={toggleGoToLine}
        onGo={(line) => {
          console.log('Go to line:', line);
        }}
        maxLines={maxLines}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        isOpen={keyboardShortcutsOpen}
        onClose={toggleKeyboardShortcuts}
      />

      {/* Settings */}
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
