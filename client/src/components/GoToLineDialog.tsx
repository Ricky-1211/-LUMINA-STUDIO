import { useState, useRef, useEffect } from 'react';

interface GoToLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGo: (line: number) => void;
  maxLines: number;
}

export default function GoToLineDialog({
  isOpen,
  onClose,
  onGo,
  maxLines,
}: GoToLineDialogProps) {
  const [lineNumber, setLineNumber] = useState('1');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setLineNumber('1');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const line = parseInt(lineNumber, 10);
    if (line > 0 && line <= maxLines) {
      onGo(line);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border p-4 w-96">
        <h2 className="text-sm font-semibold mb-3">Go to Line</h2>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="number"
            min="1"
            max={maxLines}
            value={lineNumber}
            onChange={(e) => setLineNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`1 - ${maxLines}`}
            className="flex-1 px-3 py-2 bg-input text-foreground text-sm border border-border focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-accent text-accent-foreground text-sm hover:bg-opacity-90"
          >
            Go
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-foreground text-sm hover:bg-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
