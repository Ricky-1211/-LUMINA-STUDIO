import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Command {
  id: string;
  title: string;
  category: string;
  description: string;
  icon?: string;
  keybinding?: string;
  when?: string;
  action: () => void | Promise<void>;
}

export interface CommandPaletteState {
  // Command palette state
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  recentlyUsed: string[];
  searchResults: Command[];
  
  // Command registry
  commands: Record<string, Command>;
  categories: Record<string, string>;
  
  // Command palette operations
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  executeSelectedCommand: () => void;
  executeCommand: (commandId: string) => void;
  
  // Command management
  registerCommand: (command: Command) => void;
  unregisterCommand: (commandId: string) => void;
  updateCommand: (commandId: string, updates: Partial<Command>) => void;
  
  // Search and filtering
  searchCommands: (query: string) => void;
  filterByCategory: (category: string) => void;
  clearFilters: () => void;
  
  // Recently used commands
  addToRecentlyUsed: (commandId: string) => void;
  clearRecentlyUsed: () => void;
  
  // Keybinding handling
  handleKeybinding: (keybinding: string) => boolean;
  registerKeybinding: (commandId: string, keybinding: string) => void;
  unregisterKeybinding: (commandId: string) => void;
}

export const useCommandStore = create<CommandPaletteState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOpen: false,
      query: '',
      selectedIndex: 0,
      recentlyUsed: [],
      searchResults: [],
      commands: {},
      categories: {},
      
      // Command palette operations
      toggleCommandPalette: () => {
        const { isOpen } = get();
        if (isOpen) {
          get().closeCommandPalette();
        } else {
          get().openCommandPalette();
        }
      },
      
      openCommandPalette: () => {
        set({ 
          isOpen: true, 
          query: '', 
          selectedIndex: 0 
        });
        // Focus input (handled by component)
      },
      
      closeCommandPalette: () => {
        set({ 
          isOpen: false, 
          query: '', 
          selectedIndex: 0,
          searchResults: []
        });
      },
      
      setQuery: (query) => {
        set({ query });
        get().searchCommands(query);
      },
      
      setSelectedIndex: (index) => {
        const { searchResults } = get();
        const validIndex = Math.max(0, Math.min(index, searchResults.length - 1));
        set({ selectedIndex: validIndex });
      },
      
      executeSelectedCommand: () => {
        const { selectedIndex, searchResults } = get();
        if (searchResults.length === 0) return;
        
        const command = searchResults[selectedIndex];
        get().executeCommand(command.id);
      },
      
      executeCommand: (commandId) => {
        const { commands } = get();
        const command = commands[commandId];
        
        if (!command) return;
        
        // Add to recently used
        get().addToRecentlyUsed(commandId);
        
        // Execute the command
        try {
          const result = command.action();
          // Handle async commands
          if (result instanceof Promise) {
            result.catch(error => {
              console.error(`Command ${commandId} failed:`, error);
            });
          }
        } catch (error) {
          console.error(`Command ${commandId} failed:`, error);
        }
        
        // Close command palette
        get().closeCommandPalette();
      },
      
      // Command management
      registerCommand: (command) => {
        const { commands, categories } = get();
        
        set(state => ({
          commands: {
            ...state.commands,
            [command.id]: command
          },
          categories: {
            ...state.categories,
            [command.category]: command.category
          }
        }));
      },
      
      unregisterCommand: (commandId) => {
        const { commands } = get();
        const newCommands = { ...commands };
        delete newCommands[commandId];
        
        set({ commands: newCommands });
      },
      
      updateCommand: (commandId, updates) => {
        const { commands } = get();
        const command = commands[commandId];
        
        if (!command) return;
        
        set(state => ({
          commands: {
            ...state.commands,
            [commandId]: { ...command, ...updates }
          }
        }));
      },
      
      // Search and filtering
      searchCommands: (query) => {
        const { commands, recentlyUsed } = get();
        
        if (!query.trim()) {
          // Show recently used commands when no query
          const recentCommands = recentlyUsed
            .map(id => commands[id])
            .filter(Boolean)
            .slice(0, 10);
          
          set({ searchResults: recentCommands });
          return;
        }
        
        const searchQuery = query.toLowerCase();
        const results = Object.values(commands)
          .filter(command => {
            const matchesTitle = command.title.toLowerCase().includes(searchQuery);
            const matchesDescription = command.description.toLowerCase().includes(searchQuery);
            const matchesCategory = command.category.toLowerCase().includes(searchQuery);
            const matchesKeybinding = command.keybinding?.toLowerCase().includes(searchQuery);
            
            return matchesTitle || matchesDescription || matchesCategory || matchesKeybinding;
          })
          .sort((a, b) => {
            // Prioritize recently used commands
            const aRecent = recentlyUsed.includes(a.id);
            const bRecent = recentlyUsed.includes(b.id);
            
            if (aRecent && !bRecent) return -1;
            if (!aRecent && bRecent) return 1;
            
            // Then prioritize exact title matches
            const aExact = a.title.toLowerCase() === searchQuery;
            const bExact = b.title.toLowerCase() === searchQuery;
            
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            
            // Then alphabetical
            return a.title.localeCompare(b.title);
          });
        
        set({ searchResults: results, selectedIndex: 0 });
      },
      
      filterByCategory: (category) => {
        const { commands } = get();
        const results = Object.values(commands)
          .filter(command => command.category === category);
        
        set({ searchResults: results, selectedIndex: 0 });
      },
      
      clearFilters: () => {
        get().searchCommands('');
      },
      
      // Recently used commands
      addToRecentlyUsed: (commandId) => {
        const { recentlyUsed } = get();
        
        // Remove if already exists
        const filtered = recentlyUsed.filter(id => id !== commandId);
        
        // Add to beginning
        const newRecentlyUsed = [commandId, ...filtered].slice(0, 20);
        
        set({ recentlyUsed: newRecentlyUsed });
      },
      
      clearRecentlyUsed: () => {
        set({ recentlyUsed: [] });
      },
      
      // Keybinding handling
      handleKeybinding: (keybinding) => {
        const { commands } = get();
        
        // Find command with this keybinding
        const command = Object.values(commands).find(cmd => cmd.keybinding === keybinding);
        
        if (command) {
          get().executeCommand(command.id);
          return true;
        }
        
        return false;
      },
      
      registerKeybinding: (commandId, keybinding) => {
        const { commands } = get();
        const command = commands[commandId];
        
        if (!command) return;
        
        // Check if keybinding is already used
        const existingCommand = Object.values(commands).find(cmd => cmd.keybinding === keybinding);
        if (existingCommand && existingCommand.id !== commandId) {
          console.warn(`Keybinding ${keybinding} is already used by command ${existingCommand.id}`);
          return;
        }
        
        get().updateCommand(commandId, { keybinding });
      },
      
      unregisterKeybinding: (commandId) => {
        const { commands } = get();
        const command = commands[commandId];
        
        if (!command || !command.keybinding) return;
        
        get().updateCommand(commandId, { keybinding: undefined });
      }
    }),
    {
      name: 'lumina-commands',
      partialize: (state) => ({
        recentlyUsed: state.recentlyUsed
      })
    }
  )
);

// Helper function to create VS Code-style commands
export function createVSCodeCommand(
  id: string,
  title: string,
  category: string,
  description: string,
  action: () => void | Promise<void>,
  options?: {
    keybinding?: string;
    icon?: string;
    when?: string;
  }
): Command {
  return {
    id,
    title,
    category,
    description,
    action,
    ...options
  };
}

// Built-in VS Code commands
export const BUILTIN_COMMANDS: Command[] = [
  // File operations
  createVSCodeCommand(
    'file.newFile',
    'File: New File',
    'file',
    'Create a new untitled file',
    () => {
      // Implementation would call file system store
      console.log('New file command executed');
    },
    { keybinding: 'Ctrl+N' }
  ),
  
  createVSCodeCommand(
    'file.openFolder',
    'File: Open Folder...',
    'file',
    'Open a folder from your computer',
    () => {
      // Implementation would call file system store
      console.log('Open folder command executed');
    },
    { keybinding: 'Ctrl+K Ctrl+O' }
  ),
  
  createVSCodeCommand(
    'file.save',
    'File: Save',
    'file',
    'Save the active file',
    () => {
      // Implementation would call editor store
      console.log('Save file command executed');
    },
    { keybinding: 'Ctrl+S' }
  ),
  
  // View operations
  createVSCodeCommand(
    'view.toggleSidebar',
    'View: Toggle Sidebar',
    'view',
    'Toggle the visibility of the sidebar',
    () => {
      // Implementation would call UI store
      console.log('Toggle sidebar command executed');
    },
    { keybinding: 'Ctrl+B' }
  ),
  
  createVSCodeCommand(
    'view.toggleTerminal',
    'View: Toggle Terminal',
    'view',
    'Toggle the visibility of the integrated terminal',
    () => {
      // Implementation would call terminal store
      console.log('Toggle terminal command executed');
    },
    { keybinding: 'Ctrl+`' }
  ),
  
  // Navigation operations
  createVSCodeCommand(
    'workbench.action.quickOpen',
    'File: Open File...',
    'navigation',
    'Open a file from your computer',
    () => {
      // Implementation would open quick open
      console.log('Quick open command executed');
    },
    { keybinding: 'Ctrl+P' }
  ),
  
  createVSCodeCommand(
    'workbench.action.gotoLine',
    'Go to Line...',
    'navigation',
    'Go to a specific line number',
    () => {
      // Implementation would open go to line dialog
      console.log('Go to line command executed');
    },
    { keybinding: 'Ctrl+G' }
  ),
  
  // Search operations
  createVSCodeCommand(
    'workbench.action.findInFiles',
    'Find in Files...',
    'search',
    'Search across all files in your workspace',
    () => {
      // Implementation would open global search
      console.log('Find in files command executed');
    },
    { keybinding: 'Ctrl+Shift+F' }
  ),
  
  createVSCodeCommand(
    'workbench.action.showCommands',
    'Show All Commands',
    'command',
    'Show and run all available commands',
    () => {
      // This would open the command palette itself
      console.log('Show commands command executed');
    },
    { keybinding: 'Ctrl+Shift+P' }
  ),
  
  // Editor operations
  createVSCodeCommand(
    'editor.action.formatDocument',
    'Format Document',
    'editor',
    'Format the entire document',
    () => {
      // Implementation would format the active document
      console.log('Format document command executed');
    },
    { keybinding: 'Ctrl+Shift+I' }
  ),
  
  createVSCodeCommand(
    'editor.action.commentLine',
    'Toggle Line Comment',
    'editor',
    'Toggle line comment',
    () => {
      // Implementation would toggle line comment
      console.log('Toggle line comment command executed');
    },
    { keybinding: 'Ctrl+/' }
  ),
  
  // Terminal operations
  createVSCodeCommand(
    'workbench.action.terminal.new',
    'Terminal: Create New Terminal',
    'terminal',
    'Create a new integrated terminal',
    () => {
      // Implementation would create new terminal session
      console.log('New terminal command executed');
    },
    { keybinding: 'Ctrl+Shift+`' }
  )
];
