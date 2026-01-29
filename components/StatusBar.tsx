
import React from 'react';
import { GitBranch, Wifi, Bell, Code, Info } from 'lucide-react';

interface StatusBarProps {
  language?: string;
  toolStatus?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ language = 'typescript', toolStatus }) => {
  return (
    <div className="h-7 bg-gradient-to-r from-[#1a1d2e] to-[#252a3d] text-gray-300 flex items-center justify-between px-4 text-[11px] select-none border-t border-[#2a2f45]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full cursor-pointer rounded transition-colors duration-200">
          <GitBranch size={12} />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1.5 hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full cursor-pointer rounded transition-colors duration-200">
           <Info size={12} />
           <span>0 Errors, 0 Warnings</span>
        </div>
        {toolStatus && (
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#7c3aed] to-[#4ec9b0] text-white px-3 py-0.5 rounded-full text-[10px] font-medium">
            <span>{toolStatus}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 h-full">
        <div className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full flex items-center cursor-pointer rounded transition-colors duration-200">
          Spaces: 2
        </div>
        <div className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full flex items-center cursor-pointer rounded transition-colors duration-200">
          UTF-8
        </div>
        <div className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full flex items-center cursor-pointer rounded transition-colors duration-200 gap-1">
          <Code size={12} />
          <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
        </div>
        <div className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full flex items-center cursor-pointer rounded transition-colors duration-200">
          <Wifi size={12} />
        </div>
        <div className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-2 h-full flex items-center cursor-pointer rounded transition-colors duration-200">
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
