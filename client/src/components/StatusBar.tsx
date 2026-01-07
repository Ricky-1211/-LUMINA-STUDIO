import { useEditorStore } from '@/store/editorStore';

export default function StatusBar() {
  const { files, activeTabId, currentLine, currentColumn } = useEditorStore();

  const activeFile = files.find((f) => f.id === activeTabId);

  return (
    <div className="editor-status-bar">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Ln</span>
          <span className="text-xs font-semibold">{currentLine}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Col</span>
          <span className="text-xs font-semibold">{currentColumn}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {activeFile && (
          <>
            <div className="text-xs text-muted-foreground">
              {activeFile.language.toUpperCase()}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeFile.content.split('\n').length} lines
            </div>
          </>
        )}
        <div className="text-xs text-muted-foreground">UTF-8</div>
      </div>
    </div>
  );
}
