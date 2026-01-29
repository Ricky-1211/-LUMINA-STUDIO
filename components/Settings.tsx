import { X } from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoSave: boolean;
  showWhitespace: boolean;
  showLineNumbers: boolean;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<EditorSettings>({
    fontSize: 13,
    tabSize: 2,
    wordWrap: true,
    autoSave: false,
    showWhitespace: false,
    showLineNumbers: true,
  });

  const handleSettingChange = (key: keyof EditorSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border w-full max-w-2xl max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Editor Settings */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-accent uppercase">
              Editor
            </h3>

            {/* Font Size */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Font Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) =>
                    handleSettingChange('fontSize', parseInt(e.target.value))
                  }
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {settings.fontSize}px
                </span>
              </div>
            </div>

            {/* Tab Size */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Tab Size</label>
              <select
                value={settings.tabSize}
                onChange={(e) =>
                  handleSettingChange('tabSize', parseInt(e.target.value))
                }
                className="px-2 py-1 bg-input text-foreground text-sm border border-border focus:outline-none focus:border-accent"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </div>

            {/* Word Wrap */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Word Wrap</label>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) =>
                  handleSettingChange('wordWrap', e.target.checked)
                }
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Show Line Numbers */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">
                Show Line Numbers
              </label>
              <input
                type="checkbox"
                checked={settings.showLineNumbers}
                onChange={(e) =>
                  handleSettingChange('showLineNumbers', e.target.checked)
                }
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            {/* Show Whitespace */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">
                Show Whitespace
              </label>
              <input
                type="checkbox"
                checked={settings.showWhitespace}
                onChange={(e) =>
                  handleSettingChange('showWhitespace', e.target.checked)
                }
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* File Settings */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-accent uppercase">
              Files
            </h3>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Auto Save</label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) =>
                  handleSettingChange('autoSave', e.target.checked)
                }
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Theme Info */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-accent uppercase">
              Theme
            </h3>
            <p className="text-xs text-muted-foreground">
              Current Theme: <span className="text-accent">Monochrome Dark</span>
            </p>
            <p className="text-xs text-muted-foreground">
              The editor uses a minimalist monochromatic design with cyan accents
              for optimal code visibility and reduced eye strain.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 flex justify-end gap-2">
          <button
            onClick={() => {
              // Reset to defaults
              setSettings({
                fontSize: 13,
                tabSize: 2,
                wordWrap: true,
                autoSave: false,
                showWhitespace: false,
                showLineNumbers: true,
              });
            }}
            className="px-4 py-2 bg-muted text-foreground text-sm hover:bg-secondary transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-accent-foreground text-sm hover:bg-opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
