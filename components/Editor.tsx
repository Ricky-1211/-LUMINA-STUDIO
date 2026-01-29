
import React from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  content: string;
  language: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any) => void;
}

const CodeEditor: React.FC<EditorProps> = ({ content, language, onChange, onMount }) => {
  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      value={content}
      onChange={onChange}
      onMount={onMount}
      options={{
        fontSize: 14,
        fontFamily: "'Fira Code', monospace",
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        bracketPairColorization: { enabled: true },
        automaticLayout: true,
        padding: { top: 10 },
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
      }}
    />
  );
};

export default CodeEditor;
