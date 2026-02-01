import React, { useEffect, useRef, useState } from 'react';
import { Command, File, Search, X } from 'lucide-react';
import { useEditorStore, useUIStore, useFileSystemStore, useTerminalStore } from '../store';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette() {
  const {
    files: storeFiles,
    openFile,
    addFile,
  } = useEditorStore();

  const {
    commandPaletteOpen,
    toggleCommandPalette,
  } = useUIStore();

  const { toggleTerminal } = useTerminalStore();

  const { files: fileSystemFiles } = useFileSystemStore();

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
          lastModified: Date.now(),
          encoding: 'utf-8',
          lineEnding: 'LF' as const,
          indentSize: 4,
          indentUsingSpaces: true,
          trimWhitespace: true
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
        useUIStore.getState().toggleSidebar();
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+B',
    },
    {
      id: 'toggle-search',
      label: 'Find',
      description: 'Open find dialog',
      action: () => {
        useUIStore.getState().toggleSearchPanel();
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+F',
    },
    {
      id: 'toggle-terminal',
      label: 'Toggle Terminal',
      description: 'Show or hide the terminal',
      action: () => {
        toggleTerminal();
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+`',
    },
    {
      id: 'toggle-command-palette',
      label: 'Command Palette',
      description: 'Show all available commands',
      action: () => {
        toggleCommandPalette();
      },
      shortcut: 'Ctrl+Shift+P',
    },
    ...Object.values(storeFiles).map((file) => ({
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50" onClick={() => toggleCommandPalette()}>
      <div
        className="w-full max-w-2xl bg-[#1a1a1a] border border-[#333333] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#333333]">
          <Command size={18} className="text-[#00d9ff]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#f5f5f5] placeholder-[#666666] outline-none text-sm font-mono"
          />
          <button
            onClick={toggleCommandPalette}
            className="text-[#666666] hover:text-[#f5f5f5] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#666666] text-sm">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-[#00d9ff] text-[#1a1a1a]'
                    : 'hover:bg-[#333333] text-[#f5f5f5]'
                }`}
                onClick={() => cmd.action()}
              >
                <div className="flex items-center gap-3">
                  {cmd.id.startsWith('open-') ? (
                    <File size={16} className={index === selectedIndex ? 'text-[#1a1a1a]' : 'text-[#00d9ff]'} />
                  ) : cmd.id === 'new-file' ? (
                    <File size={16} className={index === selectedIndex ? 'text-[#1a1a1a]' : 'text-[#00d9ff]'} />
                  ) : (
                    <Search size={16} className={index === selectedIndex ? 'text-[#1a1a1a]' : 'text-[#00d9ff]'} />
                  )}
                  <div>
                    <p className="text-sm font-medium">{cmd.label}</p>
                    <p className={`text-xs ${
                      index === selectedIndex ? 'text-[#1a1a1a]/70' : 'text-[#666666]'
                    }`}>
                      {cmd.description}
                    </p>
                  </div>
                </div>
                {cmd.shortcut && (
                  <span className={`text-xs px-2 py-1 ${
                    index === selectedIndex ? 'bg-[#1a1a1a]/20 text-[#1a1a1a]' : 'bg-[#333333] text-[#666666]'
                  }`}>
                    {cmd.shortcut}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-[#333333] text-xs text-[#666666]">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>Enter Execute</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
