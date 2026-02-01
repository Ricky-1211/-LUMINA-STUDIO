import { useEditorStore } from '@/store/editorStore';
import { X } from 'lucide-react';

export default function Tabs() {
  const { files, openTabs, activeTabId, setActiveTab, closeFile } =
    useEditorStore();

  const openFiles = Object.values(files).filter((f) => openTabs.includes(f.id));

  return (
    <div className="editor-tabs">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`editor-tab group flex items-center gap-2 ${
            activeTabId === file.id ? 'active' : ''
          }`}
          onClick={() => setActiveTab(file.id)}
        >
          <span className="truncate max-w-[150px]">{file.name}</span>
          {file.isDirty && (
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-secondary rounded"
            title="Close tab"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
