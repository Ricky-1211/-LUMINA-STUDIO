import React, { useState, useRef, useEffect } from 'react';
import { Hash, X } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useUIStore } from '../store/uiStore';

export default function GoToLineDialog() {
  const { goToLineOpen, toggleGoToLine } = useUIStore();
  const { activeTabId, files, setCursorPosition } = useEditorStore();
  const [lineNumber, setLineNumber] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const activeFile = activeTabId ? files[activeTabId] : null;
  const totalLines = activeFile ? activeFile.content.split('\n').length : 0;

  useEffect(() => {
    if (goToLineOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [goToLineOpen]);

  useEffect(() => {
    setError('');
  }, [lineNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const line = parseInt(lineNumber, 10);

    if (isNaN(line) || line < 1) {
      setError('Please enter a valid line number');
      return;
    }

    if (line > totalLines) {
      setError(`Line number exceeds total lines (${totalLines})`);
      return;
    }

    // Update cursor position in store
    setCursorPosition(line, 1);

    // This would integrate with Monaco Editor to actually move the cursor
    // For now, we just close the dialog
    toggleGoToLine();
    setLineNumber('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleGoToLine();
    }
  };

  if (!goToLineOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={toggleGoToLine}>
      <div
        className="bg-[#1a1a1a] border border-[#333333] shadow-2xl w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-[#00d9ff]" />
            <span className="text-sm font-medium text-[#f5f5f5]">Go to Line</span>
          </div>
          <button
            onClick={toggleGoToLine}
            className="text-[#666666] hover:text-[#f5f5f5] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-[#f5f5f5] mb-2">
              Line number (1-{totalLines})
            </label>
            <input
              ref={inputRef}
              type="text"
              value={lineNumber}
              onChange={(e) => setLineNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter line number (1-${totalLines})`}
              className="w-full bg-[#333333] text-[#f5f5f5] placeholder-[#666666] px-3 py-2 text-sm font-mono outline-none border border-[#444444] focus:border-[#00d9ff]"
            />
            {error && (
              <div className="mt-2 text-xs text-red-500">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#666666]">
            <div>Total lines: {totalLines}</div>
            <div>Press Enter to go, Escape to cancel</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!lineNumber}
              className="flex-1 px-4 py-2 bg-[#00d9ff] text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              Go to Line
            </button>
            <button
              type="button"
              onClick={toggleGoToLine}
              className="px-4 py-2 bg-[#333333] text-[#f5f5f5] hover:bg-[#444444] text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
