/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VS Code theme colors
        'vscode-bg': '#1e1e1e',
        'vscode-sidebar': '#252526',
        'vscode-tab': '#2d2d2d',
        'vscode-active-tab': '#1e1e1e',
        'vscode-border': '#1e1e1e',
        'vscode-text': '#cccccc',
        'vscode-blue': '#007acc',
        'vscode-green': '#4ec9b0',
        'vscode-yellow': '#dcdcaa',
        'vscode-red': '#f44747',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}