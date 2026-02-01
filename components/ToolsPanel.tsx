
import React, { useState } from 'react';
import { X, Search, Download, Upload, Copy, Link, History, Settings, Play, Zap } from 'lucide-react';
import { Tool, ToolCategory } from '../types';

interface ToolsPanelProps {
  activeTool?: Tool | null;
  onToolSelect?: (tool: Tool) => void;
  onClose?: () => void;
  onAction?: (action: string, data?: any) => void;
  recentTools?: Tool[];
  categories?: ToolCategory[];
  isDocked?: boolean;
}

// Helper function to render icon from icon object
const renderIcon = (icon: { component: any; size: number }) => {
  const IconComponent = icon.component;
  if (!IconComponent || typeof IconComponent !== 'function') {
    return <Zap size={icon.size} />;
  }
  return <IconComponent size={icon.size} />;
};

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  activeTool,
  onToolSelect,
  onClose,
  onAction,
  recentTools = [],
  categories = [],
  isDocked = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (activeTool && !isDocked) {
    return (
      <div className="w-80 bg-[#252526] border-l border-[#1e1e1e] flex flex-col h-full">
        {/* Tool Header */}
        <div className="h-12 border-b border-[#1e1e1e] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="text-blue-400">
              {renderIcon(activeTool.icon)}
            </div>
            <span className="text-white font-medium">{activeTool.name}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#37373d] text-gray-400 hover:text-white transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tool Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-gray-300 text-sm font-medium mb-2">Description</h3>
            <p className="text-gray-400 text-sm">{activeTool.description}</p>
          </div>

          {/* Tool Actions */}
          <div className="space-y-4">
            {activeTool.actions?.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction?.(action.id, action.data)}
                className="w-full flex items-center justify-between p-3 bg-[#2d2d2d] hover:bg-[#37373d] rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="text-green-400">
                    {renderIcon(action.icon)}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{action.name}</div>
                    <div className="text-gray-400 text-xs">{action.description}</div>
                  </div>
                </div>
                <Play size={16} className="text-gray-400" />
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-gray-300 text-sm font-medium mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2.5 bg-[#2d2d2d] hover:bg-[#37373d] rounded text-xs transition-all duration-200">
                <Copy size={14} className="inline mr-2" /> Copy
              </button>
              <button className="p-2.5 bg-[#2d2d2d] hover:bg-[#37373d] rounded text-xs transition-all duration-200">
                <Download size={14} className="inline mr-2" /> Export
              </button>
              <button className="p-2.5 bg-[#2d2d2d] hover:bg-[#37373d] rounded text-xs transition-all duration-200">
                <Link size={14} className="inline mr-2" /> Share
              </button>
              <button className="p-2.5 bg-[#2d2d2d] hover:bg-[#37373d] rounded text-xs transition-all duration-200">
                <Settings size={14} className="inline mr-2" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-12 border-b border-[#1e1e1e] flex items-center justify-between px-4">
        <h2 className="text-white font-medium">Tools</h2>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          <span className="text-xs text-gray-400">Powered by AI</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#1e1e1e]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Recent Tools */}
      {recentTools.length > 0 && (
        <div className="p-4 border-b border-[#1e1e1e]">
          <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
            <History size={14} /> Recently Used
          </h3>
          <div className="space-y-2">
            {recentTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => onToolSelect?.(tool)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-[#2d2d2d] rounded-lg transition-all duration-200"
              >
                <div className="text-blue-400">
                  {renderIcon(tool.icon)}
                </div>
                <div className="text-left">
                  <div className="text-white text-sm font-medium">{tool.name}</div>
                  <div className="text-gray-400 text-xs">{tool.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Tools by Category */}
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map(category => (
          <div key={category.id} className="mb-6">
            <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
              {renderIcon(category.icon)}
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => onToolSelect?.(tool)}
                  className="flex flex-col items-center p-3 bg-[#2d2d2d] hover:bg-[#37373d] rounded-lg transition-all duration-200"
                >
                  <div className="text-blue-400 mb-2">
                    {renderIcon(tool.icon)}
                  </div>
                  <span className="text-white text-xs font-medium">{tool.name}</span>
                  <span className="text-gray-400 text-[10px] mt-1 text-center">{tool.description}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsPanel;