import { useEditorStore } from '@/store/editorStore';
import { useEffect, useRef, useState } from 'react';
import { Command } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    toggleCommandPalette,
    files,
    openFile,
    addFile,
  } = useEditorStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'new-file',
      label: 'New File',
      description: 'Create a new file',
      action: () => {
        const newFile = {
          id: `file-${Date.now()}`,
          name: `untitled-${Date.now()}.txt`,
          path: `/untitled-${Date.now()}.txt`,
          content: '',
          language: 'plaintext',
          isDirty: false,
          isOpen: true,
        };
        addFile(newFile);
        openFile(newFile.id);
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+N',
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      description: 'Show or hide the sidebar',
      action: () => {
        useEditorStore.getState().toggleSidebar();
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+B',
    },
    {
      id: 'toggle-search',
      label: 'Find',
      description: 'Open find dialog',
      action: () => {
        useEditorStore.getState().toggleSearch();
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+F',
    },
    ...files.map((file) => ({
      id: `open-${file.id}`,
      label: file.name,
      description: `Open ${file.name}`,
      action: () => {
        openFile(file.id);
        toggleCommandPalette();
      },
    })),
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredCommands.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        toggleCommandPalette();
        break;
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="command-palette" onClick={() => toggleCommandPalette()}>
      <div
        className="command-palette-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Command size={16} className="text-accent" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="command-input flex-1"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`command-item ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={() => cmd.action()}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{cmd.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {cmd.description}
                    </p>
                  </div>
                  {cmd.shortcut && (
                    <span className="text-xs text-muted-foreground ml-4">
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
