import { useEditorStore } from '@/store/editorStore';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SearchPanel() {
  const { searchOpen, toggleSearch, files, activeTabId, updateFile } =
    useEditorStore();
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(0);

  const activeFile = files.find((f) => f.id === activeTabId);

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

  if (!searchOpen) return null;

  return (
    <div className="border-b border-border bg-secondary">
      <div className="p-3 space-y-2">
        {/* Find Row */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Find"
            value={findText}
            onChange={(e) => {
              setFindText(e.target.value);
              setCurrentMatch(0);
            }}
            className="flex-1 px-3 py-2 bg-input text-foreground text-sm border border-border focus:outline-none focus:border-accent"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMatch(Math.max(0, currentMatch - 1))}
              className="p-1 hover:bg-muted"
              title="Previous match"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={() =>
                setCurrentMatch(Math.min(matchCount - 1, currentMatch + 1))
              }
              className="p-1 hover:bg-muted"
              title="Next match"
            >
              <ChevronDown size={16} />
            </button>
            <span className="text-xs text-muted-foreground px-2">
              {matchCount > 0 ? `${currentMatch + 1}/${matchCount}` : 'No results'}
            </span>
          </div>
          <button
            onClick={toggleSearch}
            className="p-1 hover:bg-muted"
            title="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Replace Row */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Replace"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="flex-1 px-3 py-2 bg-input text-foreground text-sm border border-border focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleReplace}
            className="px-3 py-1 text-xs bg-accent text-accent-foreground hover:bg-opacity-90 transition-colors"
            title="Replace"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            className="px-3 py-1 text-xs bg-muted text-foreground hover:bg-secondary transition-colors"
            title="Replace all"
          >
            Replace All
          </button>
        </div>

        {/* Options Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMatchCase(!matchCase)}
            className={`px-2 py-1 text-xs border ${
              matchCase
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border hover:bg-muted'
            }`}
            title="Match case"
          >
            Aa
          </button>
          <button
            onClick={() => setWholeWord(!wholeWord)}
            className={`px-2 py-1 text-xs border ${
              wholeWord
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border hover:bg-muted'
            }`}
            title="Match whole word"
          >
            Ab
          </button>
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={`px-2 py-1 text-xs border ${
              useRegex
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border hover:bg-muted'
            }`}
            title="Use regular expression"
          >
            .*
          </button>
        </div>
      </div>
    </div>
  );
}
