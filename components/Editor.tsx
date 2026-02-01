
import React, { useEffect, useRef, useCallback } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  content: string;
  language: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
  onCursorPositionChange?: (line: number, column: number) => void;
  onScrollChange?: (scrollTop: number, scrollLeft: number) => void;
  onViewportChange?: (height: number, width: number) => void;
}

const CodeEditor: React.FC<EditorProps> = ({ 
  content, 
  language, 
  onChange, 
  onMount, 
  onCursorPositionChange,
  onScrollChange,
  onViewportChange
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Set up cursor position change listener
    const cursorChangeListener = editor.onDidChangeCursorPosition((e: any) => {
      if (onCursorPositionChange && e.position) {
        onCursorPositionChange(e.position.lineNumber, e.position.column);
      }
    });

    // Set up scroll listener with enhanced tracking
    const scrollListener = editor.onDidScrollChange((e: any) => {
      if (onScrollChange) {
        onScrollChange(e.scrollTop, e.scrollLeft);
      }
    });

    // Set up viewport change listener
    const viewportChangeListener = editor.onDidLayoutChange((e: any) => {
      if (onViewportChange) {
        const layoutInfo = editor.getLayoutInfo();
        onViewportChange(layoutInfo.contentHeight, layoutInfo.contentWidth);
      }
    });

    // Set up content change listener for line updates
    const contentChangeListener = editor.onDidChangeModelContent((e: any) => {
      // Handle content changes with detailed tracking
      if (e.isFlush) return; // Ignore flush events
      
      // Track line changes for perfect scrolling
      e.changes.forEach((change: any) => {
        const { range, text, textLength } = change;
        const lineDelta = text.split('\n').length - 1;
        
        // Update scroll position if lines were added/removed
        if (lineDelta !== 0 && editorRef.current) {
          const currentScrollTop = editor.getScrollTop();
          const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
          const scrollDelta = lineDelta * lineHeight;
          
          // Adjust scroll position to maintain visual continuity
          editor.setScrollTop(currentScrollTop + scrollDelta);
        }
      });
    });

    // Store listeners for cleanup
    (editor as any)._luminaListeners = {
      cursor: cursorChangeListener,
      scroll: scrollListener,
      viewport: viewportChangeListener,
      content: contentChangeListener
    };

    // Set initial viewport size
    if (onViewportChange) {
      const layoutInfo = editor.getLayoutInfo();
      onViewportChange(layoutInfo.contentHeight, layoutInfo.contentWidth);
    }

    if (onMount) onMount(editor, monaco);
  }, [onMount, onCursorPositionChange, onScrollChange, onViewportChange]);

  // Cleanup listeners when component unmounts
  useEffect(() => {
    return () => {
      if (editorRef.current && (editorRef.current as any)._luminaListeners) {
        const { cursor, scroll, viewport, content } = (editorRef.current as any)._luminaListeners;
        cursor?.dispose();
        scroll?.dispose();
        viewport?.dispose();
        content?.dispose();
      }
    };
  }, []);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      theme="vs-dark"
      value={content}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        fontFamily: "'IBM Plex Mono', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        lineNumbers: 'on',
        bracketPairColorization: { enabled: true },
        automaticLayout: true,
        padding: { top: 10 },
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'line',
        selectionHighlight: true,
        occurrencesHighlight: true,
        codeLens: false,
        folding: true,
        lineDecorationsWidth: 0,
        glyphMargin: false,
        contextmenu: true,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        wordBasedSuggestions: true,
        parameterHints: { enabled: true },
        hover: { enabled: true },
        definitionLinkOpensInPeek: false,
        links: true,
        colorDecorators: true,
        lightbulb: { enabled: true },
        codeActionsOnSave: {
          'source.fixAll': 'explicit'
        },
        // Enhanced scrolling options
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false
        },
        // Perfect scrolling configuration
        smoothScrolling: true,
        scrollPredominantAxis: false,
        fastScrollSensitivity: 5,
        mouseWheelScrollSensitivity: 1,
        mouseWheelZoom: false,
        // Line number and cursor enhancements
        lineNumbersMinChars: 3,
        showFoldingControls: 'always',
        unfoldOnClickAfterEndOfLine: true,
        // Performance optimizations
        readOnly: false,
        renderValidationDecorations: 'on',
        renderLineHighlightOnlyWhenFocus: false,
        // Accessibility improvements
        accessibilityHelpPageVisible: false,
        screenReaderAnnounceInlineSuggestion: false,
        // Enhanced editor behavior
        autoIndent: 'advanced',
        formatOnPaste: true,
        formatOnType: true,
        trimAutoWhitespace: true,
        // Line rendering
        renderWhitespace: 'selection',
        renderControlCharacters: false,
        renderIndentGuides: true,
        // Selection behavior
        selectOnLineNumbers: true,
        // Multi-cursor support
        multiCursorModifier: 'ctrlCmd',
        // Find widget
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'never',
          cursorMoveOnType: true,
          loop: true,
          seedSearchStringFromSelection: false
        }
      }}
    />
  );
};

export default CodeEditor;
