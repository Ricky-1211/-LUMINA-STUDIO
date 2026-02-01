import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, Plus, Trash2, FilePlus, FolderPlus } from 'lucide-react';
import { FileNode, FileType } from '../types';
import { useFileSystemStore } from '../store';

interface FileExplorerProps {
  files: Record<string, FileNode>;
  onSelect: (id: string) => void;
  onCreate: (parentId: string, type: FileType) => void;
  onDelete: (id: string) => void;
  activeFileId: string | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  onSelect, 
  onCreate, 
  onDelete, 
  activeFileId 
}) => {
  const { expandedFolders, toggleFolder, expandFolder, collapseFolder, expandAll, collapseAll } = useFileSystemStore();
  
  const renderTree = (parentId: string | null = null, depth = 0) => {
    // Cast Object.values to FileNode[] to fix 'unknown' type inference issues in TypeScript
    const children = (Object.values(files) as FileNode[])
      .filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

    return children.map(file => {
      const isExpanded = expandedFolders.has(file.id);
      const isSelected = activeFileId === file.id;

      return (
        <div key={file.id}>
          <div
            className={`group flex items-center py-1 px-2 cursor-pointer hover:bg-[#2a2d2e] ${
              isSelected ? 'bg-[#37373d] text-white' : 'text-gray-400'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              if (file.type === 'folder') toggleFolder(file.id);
              else onSelect(file.id);
            }}
          >
            <span className="mr-1">
              {file.type === 'folder' ? (
                isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : (
                <FileCode size={14} className="text-blue-400" />
              )}
            </span>
            {file.type === 'folder' && !isExpanded ? (
               <Folder size={14} className="mr-1.5 text-blue-300" />
            ) : file.type === 'folder' ? (
               <Folder size={14} className="mr-1.5 text-blue-300" />
            ) : null}
            <span className="text-sm flex-1 truncate">{file.name}</span>
            <div className="hidden group-hover:flex items-center space-x-1">
              {file.type === 'folder' && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onCreate(file.id, 'file'); }}
                    className="p-1.5 hover:bg-[#383b3d] rounded text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <FilePlus size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onCreate(file.id, 'folder'); }}
                    className="p-1.5 hover:bg-[#383b3d] rounded text-gray-400 hover:text-white transition-all duration-200"
                  >
                    <FolderPlus size={12} />
                  </button>
                </>
              )}
              {file.id !== 'root' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
                  className="p-1.5 hover:bg-[#383b3d] rounded text-red-400 hover:text-red-300 transition-all duration-200"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
          {file.type === 'folder' && isExpanded && renderTree(file.id, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      <div className="px-4 py-2 flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-gray-500">
        <span>Explorer: Project</span>
        <div className="flex space-x-2">
          <FilePlus 
            size={14} 
            className="cursor-pointer hover:text-white" 
            onClick={() => onCreate('root', 'file')}
          />
          <FolderPlus 
            size={14} 
            className="cursor-pointer hover:text-white" 
            onClick={() => onCreate('root', 'folder')}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderTree(null)}
      </div>
    </div>
  );
};

export default FileExplorer;
