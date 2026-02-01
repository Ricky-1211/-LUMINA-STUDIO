import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowUp, ArrowDown, X, Replace } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useUIStore } from '../store/uiStore';

export default function SearchPanel() {
  const { searchPanelOpen, toggleSearchPanel } = useUIStore();
  const { files, activeTabId, updateFile } = useEditorStore();
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeFile = activeTabId ? files[activeTabId] : null;

  useEffect(() => {
    if (searchPanelOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchPanelOpen]);

  const getMatches = () => {
    if (!activeFile || !findText) return [];

    let pattern = findText;
    if (!useRegex) {
      pattern = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    while ((match = regex.exec(activeFile.content)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }

    return matches;
  };

  const matches = getMatches();
  const matchCount = matches.length;

  const handleReplace = () => {
    if (!activeFile || !findText || matches.length === 0) return;

    const match = matches[currentMatch];
    const newContent =
      activeFile.content.substring(0, match.start) +
      replaceText +
      activeFile.content.substring(match.end);

    updateFile(activeTabId!, newContent);
  };

  const handleReplaceAll = () => {
    if (!activeFile || !findText || matches.length === 0) return;

    let newContent = activeFile.content;
    let offset = 0;

    matches.forEach((match) => {
      newContent =
        newContent.substring(0, match.start + offset) +
        replaceText +
        newContent.substring(match.end + offset);
      offset += replaceText.length - (match.end - match.start);
    });

    updateFile(activeTabId!, newContent);
    setCurrentMatch(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (e.shiftKey) {
          setCurrentMatch(prev => prev <= 0 ? matchCount - 1 : prev - 1);
        } else {
          setCurrentMatch(prev => prev >= matchCount - 1 ? 0 : prev + 1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        toggleSearchPanel();
        break;
    }
  };

  if (!searchPanelOpen) return null;

  return (
    <div className="fixed top-16 right-4 w-96 bg-[#1a1a1a] border border-[#333333] shadow-2xl z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-[#00d9ff]" />
          <span className="text-sm font-medium text-[#f5f5f5]">Find & Replace</span>
        </div>
        <button
          onClick={toggleSearchPanel}
          className="text-[#666666] hover:text-[#f5f5f5] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Find..."
            value={findText}
            onChange={(e) => {
              setFindText(e.target.value);
              setCurrentMatch(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#333333] text-[#f5f5f5] placeholder-[#666666] px-3 py-2 text-sm font-mono outline-none border border-[#444444] focus:border-[#00d9ff]"
          />
          {matchCount > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#666666]">
              {currentMatch + 1} of {matchCount}
            </div>
          )}
        </div>

        {/* Replace Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#333333] text-[#f5f5f5] placeholder-[#666666] px-3 py-2 text-sm font-mono outline-none border border-[#444444] focus:border-[#00d9ff]"
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-[#f5f5f5] cursor-pointer">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="accent-[#00d9ff]"
            />
            Case Sensitive
          </label>
          <label className="flex items-center gap-2 text-[#f5f5f5] cursor-pointer">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="accent-[#00d9ff]"
            />
            Whole Word
          </label>
          <label className="flex items-center gap-2 text-[#f5f5f5] cursor-pointer">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="accent-[#00d9ff]"
            />
            Regex
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMatch(prev => prev >= matchCount - 1 ? 0 : prev + 1)}
            disabled={matchCount === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#00d9ff] text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            <ArrowDown size={14} />
            Find Next
          </button>

          <button
            onClick={() => setCurrentMatch(prev => prev <= 0 ? matchCount - 1 : prev - 1)}
            disabled={matchCount === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#00d9ff] text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            <ArrowUp size={14} />
            Find Previous
          </button>

          <button
            onClick={handleReplace}
            disabled={matchCount === 0 || !replaceText}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#333333] text-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            <Replace size={14} />
            Replace
          </button>

          <button
            onClick={handleReplaceAll}
            disabled={matchCount === 0 || !replaceText}
            className="px-3 py-1.5 bg-[#333333] text-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
          >
            Replace All
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#333333] text-xs text-[#666666]">
        <div className="flex items-center justify-between">
          <div>Enter: Find Next | Shift+Enter: Find Previous</div>
          <div>Escape: Close</div>
        </div>
      </div>
    </div>
  );
}
