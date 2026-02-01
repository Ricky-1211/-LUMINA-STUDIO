
import React from 'react';
import { GitBranch, Wifi, Bell, Code, Info } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface StatusBarProps {
  language?: string;
  toolStatus?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ language = 'typescript', toolStatus }) => {
  const { currentLine, currentColumn } = useEditorStore();
  
  return (
    <div className="h-7 bg-[#1a1a1a] text-[#f5f5f5] flex items-center justify-between px-4 text-[11px] select-none border-t border-[#333333]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:bg-[#333333] px-2 h-full cursor-pointer transition-colors duration-200">
          <GitBranch size={12} className="text-[#00d9ff]" />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1.5 hover:bg-[#333333] px-2 h-full cursor-pointer transition-colors duration-200">
           <Info size={12} className="text-[#00d9ff]" />
           <span>0 Errors, 0 Warnings</span>
        </div>
        <div className="flex items-center gap-1.5 hover:bg-[#333333] px-2 h-full cursor-pointer transition-colors duration-200">
          <span>Ln {currentLine}, Col {currentColumn}</span>
        </div>
        {toolStatus && (
          <div className="flex items-center gap-1.5 bg-[#00d9ff] text-[#1a1a1a] px-3 py-0.5 text-[10px] font-medium">
            <span>{toolStatus}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 h-full">
        <div className="hover:bg-[#333333] px-2 h-full flex items-center cursor-pointer transition-colors duration-200">
          Spaces: 2
        </div>
        <div className="hover:bg-[#333333] px-2 h-full flex items-center cursor-pointer transition-colors duration-200">
          UTF-8
        </div>
        <div className="hover:bg-[#333333] px-2 h-full flex items-center cursor-pointer transition-colors duration-200 gap-1">
          <Code size={12} className="text-[#00d9ff]" />
          <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        </div>
        <div className="hover:bg-[#333333] px-2 h-full flex items-center cursor-pointer transition-colors duration-200">
          <Wifi size={12} className="text-[#00d9ff]" />
        </div>
        <div className="hover:bg-[#333333] px-2 h-full flex items-center cursor-pointer transition-colors duration-200">
          <Bell size={12} className="text-[#00d9ff]" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
