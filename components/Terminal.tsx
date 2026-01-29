
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight } from 'lucide-react';

interface TerminalProps {
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const [history, setHistory] = useState<string[]>(['Welcome to LUMINA Studio Terminal', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, `$ ${cmd}`];

      switch (cmd.toLowerCase()) {
        case 'help':
          newHistory.push('Available commands: help, clear, ls, node, ai, version');
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'ls':
          newHistory.push('App.tsx  index.ts  package.json  README.md  tsconfig.json');
          break;
        case 'node':
          newHistory.push('v18.15.0');
          break;
        case 'ai':
          newHistory.push('Gemini AI Engine is operational.');
          break;
        case 'version':
          newHistory.push('Gemini Code Studio v1.0.0 (Web Edition)');
          break;
        case '':
          break;
        default:
          newHistory.push(`Command not found: ${cmd}`);
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="h-64 bg-[#1e1e1e] flex flex-col border-t border-[#333333] font-mono text-sm">
      <div className="bg-[#252526] px-4 py-1.5 flex items-center justify-between border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2 text-gray-300">
          <TerminalIcon size={14} />
          <span className="text-xs font-semibold">TERMINAL</span>
        </div>
        <button onClick={onClose} className="hover:text-white text-gray-500">
          <X size={14} />
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 text-[#cccccc]">
        {history.map((line, i) => (
          <div key={i} className="mb-0.5">{line}</div>
        ))}
        <div className="flex items-center mt-1">
          <ChevronRight size={14} className="text-green-500 mr-1" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#cccccc]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
