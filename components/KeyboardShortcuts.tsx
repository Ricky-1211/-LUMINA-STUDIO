import { X } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Ctrl+K Ctrl+P', description: 'Open command palette' },
  { key: 'Ctrl+F', description: 'Open find' },
  { key: 'Ctrl+H', description: 'Open find and replace' },
  { key: 'Ctrl+G', description: 'Go to line' },
  { key: 'Ctrl+N', description: 'New file' },
  { key: 'Ctrl+B', description: 'Toggle sidebar' },
  { key: 'Ctrl+Tab', description: 'Switch to next tab' },
  { key: 'Ctrl+Shift+Tab', description: 'Switch to previous tab' },
  { key: 'Ctrl+W', description: 'Close current tab' },
  { key: 'Ctrl+S', description: 'Save file (placeholder)' },
  { key: 'Ctrl+/', description: 'Toggle comment' },
  { key: 'Alt+Up', description: 'Move line up' },
  { key: 'Alt+Down', description: 'Move line down' },
  { key: 'Ctrl+Shift+K', description: 'Delete line' },
  { key: 'Ctrl+D', description: 'Select word' },
];

export default function KeyboardShortcuts({
  isOpen,
  onClose,
}: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border w-full max-w-2xl max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {shortcut.description}
                </span>
                <code className="text-xs bg-muted px-2 py-1 text-accent">
                  {shortcut.key}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-accent-foreground text-sm hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
