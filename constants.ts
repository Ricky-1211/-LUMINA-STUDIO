// constants/index.ts
import React from 'react';
import { 
  Code, Palette, Database, GitBranch, Package, 
  Eye, Layout, Workflow, Server, Bug, BarChart, 
  Key, Cloud, Shield, Zap, Settings, Copy,
  Link, Download, Upload, Cpu, Filter, FileText,
  Terminal, Play, Pause, Home, Globe, Users,
  Lock, Database as DatabaseIcon, Folder, Search,
  MessageSquare, ChevronLeft, ChevronRight, Wand2,
  Sparkles, X, Plus, FileCode
} from 'lucide-react';
import { FileNode, Tool, ToolCategory } from './types';

// Helper function to create icon elements
const createIcon = (IconComponent: any, size: number) => 
  React.createElement(IconComponent, { size });

// Tool Categories
export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'code',
    name: 'Code Tools',
    icon: createIcon(Code, 14),
    tools: [
      {
        id: 'formatter',
        name: 'Code Formatter',
        shortName: 'Format',
        description: 'Format and beautify code',
        icon: createIcon(Layout, 20),
        category: 'code',
        actions: [
          { id: 'formatCode', name: 'Format Document', description: 'Auto-format current file', icon: createIcon(Layout, 16) },
          { id: 'minifyCode', name: 'Minify Code', description: 'Remove whitespace and comments', icon: createIcon(Filter, 16) },
          { id: 'beautifyCode', name: 'Beautify', description: 'Pretty print code', icon: createIcon(Palette, 16) }
        ]
      },
      {
        id: 'converter',
        name: 'Code Converter',
        shortName: 'Convert',
        description: 'Convert between languages',
        icon: createIcon(Cpu, 20),
        category: 'code',
        actions: [
          { id: 'convertToTypescript', name: 'To TypeScript', description: 'Convert JS to TS', icon: createIcon(Code, 16) },
          { id: 'convertToJavaScript', name: 'To JavaScript', description: 'Convert TS to JS', icon: createIcon(Code, 16) },
          { id: 'convertJsonToTypes', name: 'JSON to Types', description: 'Generate TypeScript types from JSON', icon: createIcon(DatabaseIcon, 16) }
        ]
      },
      {
        id: 'analyzer',
        name: 'Code Analyzer',
        shortName: 'Analyze',
        description: 'Analyze code quality',
        icon: createIcon(BarChart, 20),
        category: 'code',
        actions: [
          { id: 'analyzeComplexity', name: 'Complexity Analysis', description: 'Calculate code complexity', icon: createIcon(BarChart, 16) },
          { id: 'findDuplicates', name: 'Find Duplicates', description: 'Detect duplicate code', icon: createIcon(Copy, 16) }
        ]
      },
      {
        id: 'validator',
        name: 'Code Validator',
        shortName: 'Validate',
        description: 'Validate syntax and standards',
        icon: createIcon(Shield, 20),
        category: 'code',
        actions: [
          { id: 'validateSyntax', name: 'Syntax Check', description: 'Check for syntax errors', icon: createIcon(Bug, 16) },
          { id: 'lintCode', name: 'Lint Code', description: 'Run linter rules', icon: createIcon(Filter, 16) }
        ]
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI Tools',
    icon: createIcon(Zap, 14),
    tools: [
      {
        id: 'test-generator',
        name: 'Test Generator',
        shortName: 'Tests',
        description: 'Generate unit tests',
        icon: createIcon(Bug, 20),
        category: 'ai',
        actions: [
          { id: 'generateUnitTests', name: 'Generate Unit Tests', description: 'Create test suite', icon: createIcon(Bug, 16) },
          { id: 'generateIntegrationTests', name: 'Integration Tests', description: 'Create integration tests', icon: createIcon(Workflow, 16) }
        ]
      },
      {
        id: 'documentation',
        name: 'Documentation',
        shortName: 'Docs',
        description: 'Generate documentation',
        icon: createIcon(FileText, 20),
        category: 'ai',
        actions: [
          { id: 'generateJsdoc', name: 'Generate JSDoc', description: 'Create JSDoc comments', icon: createIcon(FileText, 16) },
          { id: 'createReadme', name: 'Create README', description: 'Generate README file', icon: createIcon(Home, 16) }
        ]
      },
      {
        id: 'performance',
        name: 'Performance',
        shortName: 'Perf',
        description: 'Performance analysis',
        icon: createIcon(BarChart, 20),
        category: 'ai',
        actions: [
          { id: 'analyzePerformance', name: 'Analyze Performance', description: 'Find bottlenecks', icon: createIcon(Zap, 16) },
          { id: 'optimizeCode', name: 'Optimize Code', description: 'Suggest optimizations', icon: createIcon(Sparkles, 16) }
        ]
      },
      {
        id: 'code-review',
        name: 'Code Review',
        shortName: 'Review',
        description: 'AI-powered code review',
        icon: createIcon(Eye, 20),
        category: 'ai',
        actions: [
          { id: 'reviewCode', name: 'Review Code', description: 'Get code review feedback', icon: createIcon(Eye, 16) },
          { id: 'suggestImprovements', name: 'Suggest Improvements', description: 'Get improvement suggestions', icon: createIcon(Wand2, 16) }
        ]
      }
    ]
  },
  {
    id: 'design',
    name: 'Design Tools',
    icon: createIcon(Palette, 14),
    tools: [
      {
        id: 'preview',
        name: 'Live Preview',
        shortName: 'Preview',
        description: 'Preview UI components',
        icon: createIcon(Eye, 20),
        category: 'design',
        actions: [
          { id: 'openPreview', name: 'Open Preview', description: 'Open live preview window', icon: createIcon(Eye, 16) },
          { id: 'responsivePreview', name: 'Responsive Preview', description: 'Test different screen sizes', icon: createIcon(Layout, 16) }
        ]
      },
      {
        id: 'color-picker',
        name: 'Color Picker',
        shortName: 'Colors',
        description: 'Color palette tools',
        icon: createIcon(Palette, 20),
        category: 'design',
        actions: [
          { id: 'extractColors', name: 'Extract Colors', description: 'Extract colors from code', icon: createIcon(Palette, 16) },
          { id: 'generatePalette', name: 'Generate Palette', description: 'Create color palette', icon: createIcon(Palette, 16) }
        ]
      },
      {
        id: 'ui-generator',
        name: 'UI Generator',
        shortName: 'UI Gen',
        description: 'Generate UI components',
        icon: createIcon(Layout, 20),
        category: 'design',
        actions: [
          { id: 'generateComponent', name: 'Generate Component', description: 'Create React component', icon: createIcon(Layout, 16) },
          { id: 'generateForm', name: 'Generate Form', description: 'Create form component', icon: createIcon(DatabaseIcon, 16) }
        ]
      }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: createIcon(Server, 14),
    tools: [
      {
        id: 'deployment',
        name: 'Deployment',
        shortName: 'Deploy',
        description: 'Deploy applications',
        icon: createIcon(Cloud, 20),
        category: 'devops',
        actions: [
          { id: 'generateDockerfile', name: 'Generate Dockerfile', description: 'Create Docker configuration', icon: createIcon(Package, 16) },
          { id: 'deployConfig', name: 'Deploy Config', description: 'Generate deployment config', icon: createIcon(Cloud, 16) }
        ]
      },
      {
        id: 'security',
        name: 'Security Scan',
        shortName: 'Security',
        description: 'Security analysis',
        icon: createIcon(Shield, 20),
        category: 'devops',
        actions: [
          { id: 'scanVulnerabilities', name: 'Scan Vulnerabilities', description: 'Check for security issues', icon: createIcon(Shield, 16) },
          { id: 'auditDependencies', name: 'Audit Dependencies', description: 'Check package vulnerabilities', icon: createIcon(Package, 16) }
        ]
      },
      {
        id: 'api-tools',
        name: 'API Tools',
        shortName: 'API',
        description: 'API development tools',
        icon: createIcon(Globe, 20),
        category: 'devops',
        actions: [
          { id: 'generateApiClient', name: 'Generate API Client', description: 'Create API client code', icon: createIcon(Globe, 16) },
          { id: 'testEndpoints', name: 'Test Endpoints', description: 'Test API endpoints', icon: createIcon(Play, 16) }
        ]
      }
    ]
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: createIcon(Users, 14),
    tools: [
      {
        id: 'share',
        name: 'Share Code',
        shortName: 'Share',
        description: 'Share and collaborate',
        icon: createIcon(Link, 20),
        category: 'collaboration',
        actions: [
          { id: 'createShareLink', name: 'Create Share Link', description: 'Generate shareable link', icon: createIcon(Link, 16) },
          { id: 'exportCode', name: 'Export Code', description: 'Export to various formats', icon: createIcon(Download, 16) }
        ]
      },
      {
        id: 'git-tools',
        name: 'Git Tools',
        shortName: 'Git',
        description: 'Git workflow tools',
        icon: createIcon(GitBranch, 20),
        category: 'collaboration',
        actions: [
          { id: 'generateCommit', name: 'Generate Commit', description: 'Create commit message', icon: createIcon(GitBranch, 16) },
          { id: 'createPr', name: 'Create PR', description: 'Generate pull request', icon: createIcon(GitBranch, 16) }
        ]
      }
    ]
  }
];

// Recent Tools (default)
export const RECENT_TOOLS: Tool[] = [
  {
    id: 'formatter',
    name: 'Code Formatter',
    shortName: 'Format',
    description: 'Format and beautify code',
    icon: createIcon(Layout, 20),
    category: 'code',
    actions: [
      { id: 'formatCode', name: 'Format Document', description: 'Auto-format current file', icon: createIcon(Layout, 16) },
      { id: 'minifyCode', name: 'Minify Code', description: 'Remove whitespace and comments', icon: createIcon(Filter, 16) }
    ]
  },
  {
    id: 'preview',
    name: 'Live Preview',
    shortName: 'Preview',
    description: 'Preview UI components',
    icon: createIcon(Eye, 20),
    category: 'design',
    actions: [
      { id: 'openPreview', name: 'Open Preview', description: 'Open live preview window', icon: createIcon(Eye, 16) }
    ]
  },
  {
    id: 'test-generator',
    name: 'Test Generator',
    shortName: 'Tests',
    description: 'Generate unit tests',
    icon: createIcon(Bug, 20),
    category: 'ai',
    actions: [
      { id: 'generateUnitTests', name: 'Generate Unit Tests', description: 'Create test suite', icon: createIcon(Bug, 16) }
    ]
  },
  {
    id: 'deployment',
    name: 'Deployment',
    shortName: 'Deploy',
    description: 'Deploy applications',
    icon: createIcon(Cloud, 20),
    category: 'devops'
  },
  {
    id: 'share',
    name: 'Share Code',
    shortName: 'Share',
    description: 'Share and collaborate',
    icon: createIcon(Link, 20),
    category: 'collaboration'
  }
];

// Initial Files
export const INITIAL_FILES: Record<string, FileNode> = {
  'root': { 
    id: 'root', 
    name: 'my-project', 
    type: 'folder', 
    parentId: null 
  },
  'app-tsx': { 
    id: 'app-tsx', 
    name: 'App.tsx', 
    type: 'file', 
    parentId: 'root', 
    language: 'typescript',
    content: `import React from 'react';\nimport { Sparkles, Zap, Terminal } from 'lucide-react';\n\nconst App = () => {\n  const [code, setCode] = React.useState<string>('');\n  \n  return (\n    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">\n      <header className="flex items-center justify-between mb-8">\n        <div className="flex items-center gap-3">\n          <Sparkles className="text-blue-400" size={32} />\n          <h1 className="text-3xl font-bold">Gemini Code Studio</h1>\n        </div>\n        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">\n          <Zap size={20} />\n          <span>Run Code</span>\n        </button>\n      </header>\n      \n      <div className="grid grid-cols-2 gap-6">\n        <div className="bg-gray-800 rounded-xl p-6">\n          <h2 className="text-xl font-semibold mb-4">Editor</h2>\n          <textarea \n            className="w-full h-64 bg-gray-900 text-gray-100 font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"\n            value={code}\n            onChange={(e) => setCode(e.target.value)}\n            placeholder="Write your code here..."\n          />\n        </div>\n        \n        <div className="bg-gray-800 rounded-xl p-6">\n          <h2 className="text-xl font-semibold mb-4">Output</h2>\n          <div className="bg-gray-900 rounded-lg p-4 h-64 font-mono text-sm">\n            {/* Output will appear here */}\n          </div>\n        </div>\n      </div>\n      \n      <footer className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">\n        <p>AI-powered development environment with integrated tools</p>\n      </footer>\n    </div>\n  );\n};\n\nexport default App;`
  },
  'index-ts': { 
    id: 'index-ts', 
    name: 'index.ts', 
    type: 'file', 
    parentId: 'root', 
    language: 'typescript',
    content: `// Main entry point\nimport React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './styles.css';\n\nconst root = ReactDOM.createRoot(\n  document.getElementById('root') as HTMLElement\n);\n\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n\nconsole.log('Application started successfully!');`
  },
  'styles-css': { 
    id: 'styles-css', 
    name: 'styles.css', 
    type: 'file', 
    parentId: 'root', 
    language: 'css',
    content: `/* Global styles */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n}\n\n.code-editor {\n  background: #1e1e1e;\n  color: #d4d4d4;\n  border-radius: 8px;\n  overflow: hidden;\n}\n\n.tool-button {\n  transition: all 0.2s ease;\n}\n\n.tool-button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);\n}`
  },
  'readme-md': { 
    id: 'readme-md', 
    name: 'README.md', 
    type: 'file', 
    parentId: 'root', 
    language: 'markdown',
    content: `# Gemini Code Studio\n\n## 🚀 AI-Powered Development Environment\n\n### Features\n\n- **Smart Code Editor** with AI assistance\n- **Integrated Tools Panel** for various development tasks\n- **Live Preview** of UI components\n- **Terminal Integration** for command-line operations\n- **File Explorer** with project management\n- **AI Chat** for code explanations and suggestions\n\n### Quick Start\n\n1. Open a file in the editor\n2. Use the Tools panel for code transformations\n3. Click the AI button for assistance\n4. Preview your changes in real-time\n\n### Available Tools\n\n- **Code Formatter**: Format and beautify code\n- **Test Generator**: Create unit tests automatically\n- **Live Preview**: See UI changes instantly\n- **Deployment Tools**: Prepare for production\n- **Security Scanner**: Check for vulnerabilities\n\n### Keyboard Shortcuts\n\n- \`Ctrl + Space\`: AI suggestions\n- \`Ctrl + S\`: Save file\n- \`Ctrl + T\`: Open tools panel\n- \`Ctrl + '\`: Toggle terminal\n- \`Ctrl + Shift + P\`: Command palette\n\n### Requirements\n\n- Node.js 16+ \n- Modern web browser\n- Internet connection for AI features\n\n### License\n\nMIT License - Free to use and modify.`
  },
  'utils-ts': { 
    id: 'utils-ts', 
    name: 'utils.ts', 
    type: 'file', 
    parentId: 'root', 
    language: 'typescript',
    content: `// Utility functions for Gemini Code Studio\n\nexport function formatCode(code: string): string {\n  // Basic code formatting logic\n  return code\n    .replace(/\\s+/g, ' ')\n    .replace(/\\s*([{}()\\[\\]<>])\\s*/g, '$1')\n    .trim();\n}\n\nexport function validateCode(code: string): boolean {\n  // Basic validation - check for common syntax issues\n  const hasUnclosedBrackets = (code.match(/\\(/g) || []).length !== (code.match(/\\)/g) || []).length;\n  const hasUnclosedBraces = (code.match(/\\{/g) || []).length !== (code.match(/\\}/g) || []).length;\n  \n  return !hasUnclosedBrackets && !hasUnclosedBraces;\n}\n\nexport function extractImports(code: string): string[] {\n  const importRegex = /import\\s+.*?from\\s+['\"].*?['\"]/g;\n  const matches = code.match(importRegex) || [];\n  return matches;\n}\n\nexport function countLines(code: string): number {\n  return code.split('\\n').length;\n}\n\nexport function getLanguageFromExtension(filename: string): string {\n  const extension = filename.split('.').pop()?.toLowerCase();\n  \n  const languageMap: Record<string, string> = {\n    'ts': 'typescript',\n    'tsx': 'typescript',\n    'js': 'javascript',\n    'jsx': 'javascript',\n    'css': 'css',\n    'scss': 'scss',\n    'html': 'html',\n    'json': 'json',\n    'md': 'markdown',\n    'py': 'python',\n    'java': 'java',\n    'cpp': 'cpp',\n    'go': 'go',\n    'rs': 'rust',\n    'php': 'php'\n  };\n  \n  return languageMap[extension || ''] || 'text';\n}`
  }
};

// Monaco Editor Theme Configuration
export const MONACO_THEME_CONFIG = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: '569CD6' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' }
  ],
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    'editor.lineHighlightBackground': '#2d2d2d',
    'editor.selectionBackground': '#264f78',
    'editorCursor.foreground': '#ffffff',
    'editorWhitespace.foreground': '#404040'
  }
};

// Sidebar Views Configuration
export const SIDEBAR_VIEWS = [
  { id: 'explorer', name: 'Explorer', icon: createIcon(Folder, 18) },
  { id: 'search', name: 'Search', icon: createIcon(Search, 18) },
  { id: 'git', name: 'Git', icon: createIcon(GitBranch, 18) },
  { id: 'debug', name: 'Debug', icon: createIcon(Bug, 18) },
  { id: 'tools', name: 'Tools', icon: createIcon(Zap, 18) },
  { id: 'ai_chat', name: 'AI Chat', icon: createIcon(MessageSquare, 18) },
  { id: 'extensions', name: 'Extensions', icon: createIcon(Settings, 18) }
];

// File Type Icons Mapping
export const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  'typescript': React.createElement(FileCode, { className: "text-blue-400", size: 16 }),
  'javascript': React.createElement(FileCode, { className: "text-yellow-400", size: 16 }),
  'css': React.createElement(FileCode, { className: "text-pink-400", size: 16 }),
  'html': React.createElement(FileCode, { className: "text-orange-400", size: 16 }),
  'json': React.createElement(FileCode, { className: "text-green-400", size: 16 }),
  'markdown': React.createElement(FileCode, { className: "text-gray-400", size: 16 }),
  'python': React.createElement(FileCode, { className: "text-blue-500", size: 16 }),
  'java': React.createElement(FileCode, { className: "text-red-400", size: 16 }),
  'default': React.createElement(FileCode, { className: "text-gray-400", size: 16 })
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'O'], action: 'Open File' },
  { keys: ['Ctrl', 'S'], action: 'Save File' },
  { keys: ['Ctrl', 'Shift', 'S'], action: 'Save All' },
  { keys: ['Ctrl', 'Space'], action: 'AI Suggestions' },
  { keys: ['Ctrl', 'T'], action: 'Open Tools' },
  { keys: ['Ctrl', '`'], action: 'Toggle Terminal' },
  { keys: ['Ctrl', 'Shift', 'P'], action: 'Command Palette' },
  { keys: ['Ctrl', 'F'], action: 'Find' },
  { keys: ['Ctrl', 'H'], action: 'Replace' },
  { keys: ['Ctrl', '/'], action: 'Toggle Comment' },
  { keys: ['F5'], action: 'Run/Debug' },
  { keys: ['F12'], action: 'Go to Definition' }
];

// Default Terminal Commands
export const TERMINAL_COMMANDS = [
  { command: 'npm install', description: 'Install dependencies' },
  { command: 'npm start', description: 'Start development server' },
  { command: 'npm run build', description: 'Build for production' },
  { command: 'npm test', description: 'Run tests' },
  { command: 'git status', description: 'Check git status' },
  { command: 'git add .', description: 'Stage all changes' },
  { command: 'git commit -m "message"', description: 'Commit changes' },
  { command: 'git push', description: 'Push to remote' },
  { command: 'ls -la', description: 'List files' },
  { command: 'pwd', description: 'Print working directory' }
];