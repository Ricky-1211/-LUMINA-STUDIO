import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FileCode, Regex, Search } from 'lucide-react';
import { FileNode } from '../types';

export interface SearchMatch {
  fileId: string;
  fileName: string;
  lineNumber: number;
  column: number;
  lineText: string;
  matchText: string;
}

interface SearchViewProps {
  files: Record<string, FileNode>;
  onOpenMatch: (match: SearchMatch) => void;
}

const MAX_MATCHES = 500;

const SearchView: React.FC<SearchViewProps> = ({ files, onOpenMatch }) => {
  const [query, setQuery] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const matchesByFile = useMemo(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return new Map<string, SearchMatch[]>();

    let regex: RegExp | null = null;
    if (isRegex) {
      try {
        const flags = `${isCaseSensitive ? '' : 'i'}g`;
        regex = new RegExp(normalizedQuery, flags);
      } catch {
        return new Map<string, SearchMatch[]>();
      }
    }

    const map = new Map<string, SearchMatch[]>();
    const fileItems = (Object.values(files) as FileNode[]).filter((f) => f.type === 'file' && typeof f.content === 'string');

    let total = 0;
    for (const f of fileItems) {
      if (total >= MAX_MATCHES) break;
      const content = f.content ?? '';
      const lines = content.split(/\r?\n/);

      for (let i = 0; i < lines.length; i++) {
        if (total >= MAX_MATCHES) break;

        const line = lines[i] ?? '';

        if (isRegex && regex) {
          regex.lastIndex = 0;
          let match: RegExpExecArray | null;
          while ((match = regex.exec(line)) !== null) {
            const matchText = match[0] ?? '';
            const column = match.index + 1;
            const item: SearchMatch = {
              fileId: f.id,
              fileName: f.name,
              lineNumber: i + 1,
              column,
              lineText: line,
              matchText,
            };

            if (!map.has(f.id)) map.set(f.id, []);
            map.get(f.id)!.push(item);

            total++;
            if (total >= MAX_MATCHES) break;

            if (matchText.length === 0) {
              regex.lastIndex = regex.lastIndex + 1;
            }
          }
        } else {
          const haystack = isCaseSensitive ? line : line.toLowerCase();
          const needle = isCaseSensitive ? normalizedQuery : normalizedQuery.toLowerCase();

          let startIdx = 0;
          for (;;) {
            const idx = haystack.indexOf(needle, startIdx);
            if (idx === -1) break;

            const item: SearchMatch = {
              fileId: f.id,
              fileName: f.name,
              lineNumber: i + 1,
              column: idx + 1,
              lineText: line,
              matchText: line.substring(idx, idx + needle.length),
            };

            if (!map.has(f.id)) map.set(f.id, []);
            map.get(f.id)!.push(item);

            total++;
            if (total >= MAX_MATCHES) break;

            startIdx = idx + Math.max(1, needle.length);
          }
        }
      }
    }

    return map;
  }, [files, isCaseSensitive, isRegex, query]);

  const fileGroups = useMemo(() => {
    return Array.from(matchesByFile.entries()).sort((a, b) => {
      const aName = a[1][0]?.fileName ?? '';
      const bName = b[1][0]?.fileName ?? '';
      return aName.localeCompare(bName);
    });
  }, [matchesByFile]);

  const totalMatches = useMemo(() => {
    let total = 0;
    for (const [, ms] of Array.from(matchesByFile.entries())) total += ms.length;
    return total;
  }, [matchesByFile]);

  const toggleFileExpanded = (fileId: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  useEffect(() => {
    if (!query.trim()) {
      setExpandedFiles(new Set());
      return;
    }
    setExpandedFiles(new Set(Array.from(matchesByFile.keys())));
  }, [matchesByFile, query]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-[#1e1e1e]">
        Search
      </div>

      <div className="p-3 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2 bg-[#2d2d2d] border border-[#444] rounded px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setExpandedFiles(new Set(Array.from(matchesByFile.keys())));
              }
            }}
          />

          <button
            onClick={() => setIsCaseSensitive((v) => !v)}
            className={`px-2 py-1.5 rounded text-[10px] border transition-all duration-200 ${
              isCaseSensitive ? 'bg-[#094771] border-[#007acc] text-white' : 'bg-transparent border-[#444] text-gray-400 hover:text-white'
            }`}
            title="Match Case"
          >
            Aa
          </button>

          <button
            onClick={() => setIsRegex((v) => !v)}
            className={`p-1.5 rounded border transition-all duration-200 ${
              isRegex ? 'bg-[#094771] border-[#007acc] text-white' : 'bg-transparent border-[#444] text-gray-400 hover:text-white'
            }`}
            title="Use Regular Expression"
          >
            <Regex size={14} />
          </button>
        </div>

        <div className="mt-2 text-[11px] text-gray-500">
          {query.trim()
            ? `${Math.min(totalMatches, MAX_MATCHES)} matches in ${matchesByFile.size} files${totalMatches > MAX_MATCHES ? ' (showing first 500)' : ''}`
            : 'Type to search across files'}
        </div>

        {isRegex && query.trim() && (() => {
          try {
            const flags = `${isCaseSensitive ? '' : 'i'}g`;
            new RegExp(query.trim(), flags);
            return null;
          } catch {
            return <div className="mt-2 text-[11px] text-red-400">Invalid regular expression</div>;
          }
        })()}
      </div>

      <div className="flex-1 overflow-y-auto">
        {fileGroups.length === 0 && query.trim() ? (
          <div className="p-4 text-sm text-gray-500">No results</div>
        ) : (
          fileGroups.map(([fileId, matches]) => {
            const isExpanded = expandedFiles.has(fileId);
            const header = matches[0];
            if (!header) return null;

            return (
              <div key={fileId} className="border-b border-[#1e1e1e]">
                <button
                  onClick={() => toggleFileExpanded(fileId)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[#2a2d2e] transition-all duration-200"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-500" />
                  )}
                  <FileCode size={14} className="text-[#007acc]" />
                  <span className="text-sm text-gray-200 truncate flex-1">{header.fileName}</span>
                  <span className="text-[11px] text-gray-500">{matches.length}</span>
                </button>

                {isExpanded && (
                  <div className="pb-2">
                    {matches.slice(0, 200).map((m, idx) => (
                      <button
                        key={`${m.fileId}-${m.lineNumber}-${m.column}-${idx}`}
                        onClick={() => onOpenMatch(m)}
                        className="w-full px-8 py-2 text-left hover:bg-[#2a2d2e] transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 w-12">{m.lineNumber}:{m.column}</span>
                          <span className="text-[11px] text-gray-300 truncate flex-1">{m.lineText.trim() || ' '}</span>
                        </div>
                      </button>
                    ))}
                    {matches.length > 200 && (
                      <div className="px-8 py-2 text-[11px] text-gray-500">Showing first 200 matches for this file</div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchView;
