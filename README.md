# VS Code Clone - Modern Web-Based Code Editor

A professional, minimalist code editor built with React, TypeScript, and Monaco Editor. Designed with a clean monochromatic aesthetic and optimized for developer productivity.

## Features

### Core Editing
- **Monaco Editor Integration**: Industry-standard code editor with syntax highlighting for 100+ languages
- **Multiple File Tabs**: Open and switch between multiple files seamlessly
- **Real-time Editing**: Instant code updates with automatic syntax highlighting
- **Syntax Highlighting**: Support for JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown, and more

### File Management
- **File Explorer Sidebar**: Browse and manage files in a tree-like structure
- **Create/Delete Files**: Quick file operations with dirty state tracking
- **File Status Indicators**: Visual indicators for unsaved changes (dirty state)

### Navigation & Search
- **Command Palette** (Ctrl+K Ctrl+P): Quick access to all commands and files
- **Find & Replace** (Ctrl+F): Powerful search with regex support, case sensitivity, and whole word matching
- **Go to Line** (Ctrl+G): Jump to specific line numbers instantly
- **Tab Navigation**: Switch between open files with keyboard shortcuts

### Developer Experience
- **Status Bar**: Real-time display of cursor position, language, file statistics
- **Keyboard Shortcuts**: Comprehensive keyboard support for power users
- **Minimalist UI**: Clean, distraction-free interface focused on code
- **Monochromatic Design**: Professional dark theme with cyan accents for critical UI elements

## Design Philosophy

The editor follows a **Minimalist Monochromatic** design approach:

- **Deep Charcoal Background** (#1a1a1a): Reduces eye strain during extended coding sessions
- **Off-white Text** (#f5f5f5): High contrast for readability
- **Cyan Accents** (#00d9ff): Strategic use for active states and interactive elements
- **Sharp Geometric Layout**: No rounded corners, Swiss-style modernism
- **IBM Plex Mono Typography**: Professional monospace font for consistent code presentation

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K Ctrl+P | Open command palette |
| Ctrl+F | Open find |
| Ctrl+H | Open find and replace |
| Ctrl+G | Go to line |
| Ctrl+N | New file |
| Ctrl+B | Toggle sidebar |
| Ctrl+Tab | Switch to next tab |
| Ctrl+Shift+Tab | Switch to previous tab |
| Ctrl+W | Close current tab |
| Ctrl+Shift+? | Show keyboard shortcuts |

## Architecture

### Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Project Structure
```
client/
  src/
    components/
      Editor.tsx              # Monaco Editor wrapper
      Sidebar.tsx             # File explorer
      Tabs.tsx                # Tab management
      StatusBar.tsx           # Status information
      CommandPalette.tsx      # Command palette
      SearchPanel.tsx         # Find & replace
      GoToLineDialog.tsx      # Go to line dialog
      KeyboardShortcuts.tsx    # Shortcuts reference
    store/
      editorStore.ts          # Zustand state management
    pages/
      Home.tsx                # Main editor layout
    App.tsx                   # Application root
    index.css                 # Global styles & design tokens
```

### State Management

The editor uses **Zustand** for centralized state management:

```typescript
interface EditorState {
  // File data
  files: EditorFile[]
  openTabs: string[]
  activeTabId: string | null
  
  // UI state
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  searchOpen: boolean
  goToLineOpen: boolean
  keyboardShortcutsOpen: boolean
  
  // Editor state
  currentLine: number
  currentColumn: number
  
  // Actions
  addFile, updateFile, deleteFile, openFile, closeFile
  toggleSidebar, toggleCommandPalette, toggleSearch, etc.
}
```

## Getting Started

### Installation
```bash
cd vscode-clone
pnpm install
```

### Development
```bash
pnpm dev
```

The editor will be available at `http://localhost:3000`

### Building
```bash
pnpm build
```

## Usage

1. **Open the Editor**: Navigate to the application URL
2. **Create a File**: Use Ctrl+N or the Command Palette
3. **Edit Code**: Click on a file to open it in the editor
4. **Search**: Use Ctrl+F to find text within the current file
5. **Navigate**: Use Ctrl+G to jump to specific lines
6. **Manage Tabs**: Click the X button on tabs to close files

## Supported Languages

The editor supports syntax highlighting for:
- JavaScript/TypeScript
- Python
- HTML/CSS
- JSON
- Markdown
- Java
- C/C++
- Ruby
- PHP
- Go
- Rust
- And 90+ more languages via Monaco Editor

## Features Roadmap

### Planned Features
- Git integration (status, diff, commit)
- Integrated terminal
- Extension/plugin system
- Themes customization
- AI-powered code completion
- Multi-cursor editing
- Code folding
- Minimap navigation
- Bracket matching
- Auto-formatting
- Debugging support

### Optional Advanced Features
- IntelliSense (auto-complete & error detection)
- Live preview for web files
- File watchers and auto-reload
- Project configuration files (.editorconfig, .prettierrc)
- Custom keybindings
- Workspace settings

## Performance Considerations

- **Lazy Loading**: Components load on demand
- **Efficient State Updates**: Zustand provides minimal re-renders
- **Monaco Editor Optimization**: Configured for performance with minimap disabled
- **Smooth Scrolling**: Enabled for better UX
- **Debounced Search**: Prevents excessive updates during typing

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all features
- **High Contrast**: Monochromatic design ensures text visibility
- **Focus Indicators**: Clear visual feedback for keyboard navigation
- **ARIA Labels**: Semantic HTML for screen readers

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Feel free to use this editor for personal and commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

**Built with ❤️ using React, TypeScript, and Monaco Editor**
