import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FileCode, Search, X } from 'lucide-react';
import { FileNode } from '../types';

interface QuickOpenModalProps {
  isOpen: boolean;
  files: Record<string, FileNode>;
  openTabIds: string[];
  onOpenFile: (id: string) => void;
  onClose: () => void;
}

const QuickOpenModal: React.FC<QuickOpenModalProps> = ({
  isOpen,
  files,
  openTabIds,
  onOpenFile,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();
  }, [isOpen]);

  const fileItems = useMemo(() => {
    const allFiles = (Object.values(files) as FileNode[]).filter((f) => f.type === 'file');

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? allFiles.filter((f) => f.name.toLowerCase().includes(normalizedQuery))
      : allFiles;

    const openSet = new Set(openTabIds);
    filtered.sort((a, b) => {
      const aOpen = openSet.has(a.id);
      const bOpen = openSet.has(b.id);
      if (aOpen !== bOpen) return aOpen ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [files, openTabIds, query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, Math.max(0, fileItems.length - 1)));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const item = fileItems[activeIndex];
        if (!item) return;
        onOpenFile(item.id);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, fileItems, isOpen, onClose, onOpenFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[720px] max-w-[90vw] rounded-xl border border-[#333] bg-[#1e1e1e] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2d2d2d] bg-[#252526]">
          <Search size={16} className="text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type a file name to open..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {fileItems.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No matching files</div>
          ) : (
            fileItems.map((f, idx) => (
              <button
                key={f.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  onOpenFile(f.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm border-b border-[#2d2d2d] transition-all duration-200 ${
                  idx === activeIndex ? 'bg-[#094771] text-white' : 'bg-transparent text-gray-300 hover:bg-[#2a2d2e]'
                }`}
              >
                <FileCode size={16} className="text-[#007acc]" />
                <span className="truncate flex-1">{f.name}</span>
                {openTabIds.includes(f.id) && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#2d2d2d] text-gray-300">Open</span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 text-[11px] text-gray-500 bg-[#252526] border-t border-[#2d2d2d]">
          <span className="text-gray-400">Enter</span> to open
          <span className="mx-2">|</span>
          <span className="text-gray-400">Esc</span> to close
        </div>
      </div>
    </div>
  );
};

export default QuickOpenModal;
