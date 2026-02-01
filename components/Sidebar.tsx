import { useEditorStore } from '@/store/editorStore';
import { ChevronRight, File, Folder, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const { files, openTabs, activeTabId, openFile, closeFile, deleteFile } =
    useEditorStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (fileId: string) => {
    openFile(fileId);
  };

  const handleDeleteFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    deleteFile(fileId);
  };

  return (
    <div className="editor-sidebar flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Explorer</h2>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(files).length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-xs">
            <p>No files</p>
          </div>
        ) : (
          <div className="py-2">
            {Object.values(files).map((file) => (
              <div
                key={file.id}
                className={`file-tree-item group flex items-center justify-between ${
                  activeTabId === file.id ? 'active' : ''
                }`}
                onClick={() => handleFileClick(file.id)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <File size={14} className="mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                {file.isDirty && (
                  <div className="w-2 h-2 rounded-full bg-accent mr-2 flex-shrink-0" />
                )}
                <button
                  onClick={(e) => handleDeleteFile(e, file.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary"
                  title="Delete file"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <p>{Object.keys(files).length} file(s)</p>
      </div>
    </div>
  );
}
