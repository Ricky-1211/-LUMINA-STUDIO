import { Menu, Settings, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';

interface TopBarProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

export default function TopBar({ onSettingsClick, onHelpClick }: TopBarProps) {
  const { toggleSidebar, toggleCommandPalette } = useEditorStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-secondary border-b border-border px-4 py-2 flex items-center justify-between h-12">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 hover:bg-muted rounded transition-colors relative"
          title="Menu"
        >
          <Menu size={18} />

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-border shadow-lg z-50 min-w-48">
              <button
                onClick={() => {
                  toggleSidebar();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors"
              >
                Toggle Sidebar
              </button>
              <button
                onClick={() => {
                  toggleCommandPalette();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors"
              >
                Command Palette
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => {
                  onSettingsClick();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <Settings size={14} />
                Settings
              </button>
              <button
                onClick={() => {
                  onHelpClick();
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <HelpCircle size={14} />
                Help
              </button>
            </div>
          )}
        </button>

        <h1 className="text-sm font-semibold text-foreground">VS Code Clone</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSettingsClick}
          className="p-1 hover:bg-muted rounded transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <button
          onClick={onHelpClick}
          className="p-1 hover:bg-muted rounded transition-colors"
          title="Help"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}
