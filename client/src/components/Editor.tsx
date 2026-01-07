import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';
import { useEffect, useRef } from 'react';

export default function Editor() {
  const {
    files,
    activeTabId,
    updateFile,
    setCursorPosition,
  } = useEditorStore();

  const editorRef = useRef<any>(null);

  const activeFile = files.find((f) => f.id === activeTabId);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeTabId) {
      updateFile(activeTabId, value);
    }
  };

  const handleEditorMountInternal = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCursorPositionChange = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      if (position) {
        setCursorPosition(position.lineNumber, position.column);
      }
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const disposable = editor.onDidChangeCursorPosition(() => {
        handleCursorPositionChange();
      });
      return () => disposable.dispose();
    }
  }, []);

  if (!activeFile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">Open a file from the sidebar to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100%"
      language={activeFile.language}
      value={activeFile.content}
      onChange={handleEditorChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: 'IBM Plex Mono',
        lineHeight: 1.5,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
        insertSpaces: true,
        renderLineHighlight: 'none',
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
        },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        renderWhitespace: 'none',
        smoothScrolling: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'on',
      }}
      beforeMount={(monaco) => {
        // Define custom theme for monochrome aesthetic
        monaco.editor.defineTheme('monochrome-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '666666' },
            { token: 'string', foreground: 'b8b8b8' },
            { token: 'number', foreground: 'b8b8b8' },
            { token: 'builtin', foreground: 'f5f5f5' },
            { token: 'keyword', foreground: 'f5f5f5' },
            { token: 'type', foreground: 'e0e0e0' },
            { token: 'variable', foreground: 'f5f5f5' },
            { token: 'function', foreground: 'e0e0e0' },
            { token: 'operator', foreground: 'b8b8b8' },
          ],
          colors: {
            'editor.background': '#1a1a1a',
            'editor.foreground': '#f5f5f5',
            'editor.lineNumbersBackground': '#1a1a1a',
            'editor.lineNumbersForeground': '#666666',
            'editor.lineHighlightBackground': '#242424',
            'editor.selectionBackground': '#00d9ff33',
            'editor.selectionForeground': '#f5f5f5',
            'editor.inactiveSelectionBackground': '#00d9ff1a',
            'editorCursor.foreground': '#00d9ff',
            'editorWhitespace.foreground': '#333333',
            'editorIndentGuide.background': '#2a2a2a',
            'editorIndentGuide.activeBackground': '#3a3a3a',
            'editorBracketMatch.background': '#00d9ff33',
            'editorBracketMatch.border': '#00d9ff',
            'editorError.foreground': '#ff4444',
            'editorWarning.foreground': '#ffaa00',
          },
        });
      }}
      onMount={(editor) => {
        handleEditorMountInternal(editor);
        editor.updateOptions({ theme: 'monochrome-dark' });
      }}
    />
  );
}
