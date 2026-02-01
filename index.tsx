import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, Search, FileCode, Plus, Terminal as TerminalIcon, 
  Sparkles, Wand2, Settings, Palette, Layers, 
  Database, Zap, GitBranch, Package, Eye, 
  Layout, Code, Workflow, Server, Bug, 
  BarChart, Key, Cloud, Shield, Download,
  Upload, Copy, Link, History, FolderOpen
} from 'lucide-react';
import ActivityBar from './components/ActivityBar';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/Editor';
import StatusBar from './components/StatusBar';
import AIChatView from './components/AIChatView';
import Terminal from './components/Terminal';
import ToolsPanel from './components/ToolsPanel';
import QuickOpenModal from './components/QuickOpenModal';
import SearchView, { SearchMatch } from './components/SearchView';
import { FileNode, SidebarView, ToolCategory, Tool } from './types';
import { INITIAL_FILES, TOOL_CATEGORIES, RECENT_TOOLS } from './constants';
import { 
  explainCode, 
  refactorCode, 
  generateCodeFromPrompt 
} from './services/geminiService';

type PendingLocation = {
  fileId: string;
  lineNumber: number;
  column: number;
  length: number;
};

type IndexProps = {
  embedded?: boolean;
};

const Index: React.FC<IndexProps> = ({ embedded = false }) => {
  const [files, setFiles] = useState<Record<string, FileNode>>(INITIAL_FILES);
  const [activeTabId, setActiveTabId] = useState<string | null>('app-tsx');
  const [openTabIds, setOpenTabIds] = useState<string[]>(['app-tsx']);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeSidebarView, setActiveSidebarView] = useState<SidebarView>('explorer');
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [aiWorking, setAiWorking] = useState(false);
  const [toolsPanelVisible, setToolsPanelVisible] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [recentTools, setRecentTools] = useState<Tool[]>(RECENT_TOOLS);
  const [showAllTools, setShowAllTools] = useState(false);
  const [quickOpenVisible, setQuickOpenVisible] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<PendingLocation | null>(null);
  
  const editorRef = useRef<any>(null);

  // Persistence to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('gemini-studio-files');
    if (saved) {
      try {
        setFiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
    
    const savedRecentTools = localStorage.getItem('gemini-studio-recent-tools');
    if (savedRecentTools) {
      try {
        setRecentTools(JSON.parse(savedRecentTools));
      } catch (e) {
        console.error("Failed to load recent tools", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gemini-studio-files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('gemini-studio-recent-tools', JSON.stringify(recentTools));
  }, [recentTools]);

  useEffect(() => {
    const shouldIgnoreHotkey = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.closest('.monaco-editor')) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || target.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (shouldIgnoreHotkey(e.target)) return;

      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (ctrlOrMeta && key === 'p') {
        e.preventDefault();
        setQuickOpenVisible(true);
        return;
      }

      if (ctrlOrMeta && e.shiftKey && key === 'f') {
        e.preventDefault();
        setActiveSidebarView('search');
        setSidebarVisible(true);
        return;
      }

      if (ctrlOrMeta && e.key === '`') {
        e.preventDefault();
        setTerminalVisible((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleFileSelect = useCallback((id: string) => {
    if (!openTabIds.includes(id)) {
      setOpenTabIds(prev => [...prev, id]);
    }
    setActiveTabId(id);
  }, [openTabIds]);

  const handleOpenSearchMatch = useCallback((match: SearchMatch) => {
    handleFileSelect(match.fileId);
    setPendingLocation({
      fileId: match.fileId,
      lineNumber: match.lineNumber,
      column: match.column,
      length: match.matchText.length,
    });
  }, [handleFileSelect]);

  useEffect(() => {
    if (!pendingLocation) return;
    if (activeTabId !== pendingLocation.fileId) return;
    if (!editorRef.current) return;

    const { lineNumber, column, length } = pendingLocation;
    requestAnimationFrame(() => {
      try {
        editorRef.current.setPosition({ lineNumber, column });
        editorRef.current.revealPositionInCenter({ lineNumber, column });
        editorRef.current.setSelection({
          startLineNumber: lineNumber,
          startColumn: column,
          endLineNumber: lineNumber,
          endColumn: column + Math.max(1, length),
        });
        editorRef.current.focus();
      } finally {
        setPendingLocation(null);
      }
    });
  }, [activeTabId, pendingLocation]);

  const closeTab = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenTabs = openTabIds.filter(tid => tid !== id);
    setOpenTabIds(newOpenTabs);
    if (activeTabId === id) {
      setActiveTabId(newOpenTabs.length > 0 ? newOpenTabs[newOpenTabs.length - 1] : null);
    }
  }, [openTabIds, activeTabId]);

  const handleCreateFile = useCallback((parentId: string, type: 'file' | 'folder') => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const id = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    const newFile: FileNode = {
      id,
      name,
      type,
      parentId,
      content: type === 'file' ? '' : undefined,
      language: name.endsWith('.ts') || name.endsWith('.tsx') ? 'typescript' : 
               name.endsWith('.js') || name.endsWith('.jsx') ? 'javascript' :
               name.endsWith('.css') ? 'css' :
               name.endsWith('.html') ? 'html' :
               name.endsWith('.json') ? 'json' : 'text'
    };

    setFiles(prev => ({ ...prev, [id]: newFile }));
    if (type === 'file') handleFileSelect(id);
  }, [handleFileSelect]);

  const handleDeleteFile = useCallback((id: string) => {
    if (id === 'root') return;
    if (!confirm('Are you sure you want to delete this?')) return;

    setFiles(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    setOpenTabIds(prev => prev.filter(tid => tid !== id));
    if (activeTabId === id) setActiveTabId(null);
  }, [activeTabId]);

  const handleContentChange = useCallback((value: string | undefined) => {
    if (activeTabId && value !== undefined) {
      setFiles(prev => ({
        ...prev,
        [activeTabId]: { ...prev[activeTabId], content: value }
      }));
    }
  }, [activeTabId]);

  const handleToolSelect = useCallback((tool: Tool) => {
    setActiveTool(tool);
    setToolsPanelVisible(true);
    
    // Add to recent tools
    setRecentTools(prev => {
      const filtered = prev.filter(t => t.id !== tool.id);
      return [tool, ...filtered].slice(0, 5);
    });
  }, []);

  const handleToolAction = useCallback(async (action: string) => {
    if (!activeTabId || !files[activeTabId]?.content) return;

    const currentContent = files[activeTabId].content!;
    const language = files[activeTabId].language || 'text';

    switch (action) {
      case 'formatCode':
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.formatDocument').run();
        }
        break;
        
      case 'minifyCode':
        const minified = currentContent.replace(/\s+/g, ' ').trim();
        handleContentChange(minified);
        break;
        
      case 'beautifyCode':
        alert('Beautify functionality would be implemented here');
        break;
        
      case 'convertToTypescript':
        setAiWorking(true);
        try {
          const prompt = `Convert this JavaScript code to TypeScript:\n\n${currentContent}`;
          const result = await generateCodeFromPrompt(prompt, 'typescript');
          handleContentChange(result.code);
        } catch (error) {
          console.error('Conversion error:', error);
        } finally {
          setAiWorking(false);
        }
        break;
        
      case 'generateTest':
        setAiWorking(true);
        try {
          const prompt = `Generate unit tests for this code:\n\n${currentContent}`;
          const result = await generateCodeFromPrompt(prompt, language);
          const testFileName = `${activeTabId.split('.')[0]}.test.${language === 'typescript' ? 'ts' : 'js'}`;
          const testFileId = `${testFileName}-${Date.now()}`;
          const newTestFile: FileNode = {
            id: testFileId,
            name: testFileName,
            type: 'file',
            parentId: 'root',
            content: result.code,
            language: language
          };
          setFiles(prev => ({ ...prev, [testFileId]: newTestFile }));
          handleFileSelect(testFileId);
        } catch (error) {
          console.error('Test generation error:', error);
        } finally {
          setAiWorking(false);
        }
        break;
        
      case 'analyzePerformance':
        setAiWorking(true);
        try {
          const result = await explainCode(currentContent, language);
          alert(`Performance Analysis:\n\n${result.explanation}`);
        } catch (error) {
          console.error('Analysis error:', error);
        } finally {
          setAiWorking(false);
        }
        break;
        
      default:
        console.log(`Action ${action} triggered`);
    }
  }, [activeTabId, files, handleContentChange, handleFileSelect]);

  const handleAIExplain = useCallback(async () => {
    if (!activeTabId || !files[activeTabId]?.content) return;
    setAiWorking(true);
    setActiveSidebarView('ai_chat');
    setSidebarVisible(true);
    
    try {
      const result = await explainCode(files[activeTabId].content!, files[activeTabId].language || 'text');
      alert(result.explanation);
    } catch (error) {
      console.error('Explanation error:', error);
    } finally {
      setAiWorking(false);
    }
  }, [activeTabId, files]);

  const handleAIRefactor = useCallback(async () => {
    if (!activeTabId || !files[activeTabId]?.content) return;
    setAiWorking(true);
    try {
      const result = await refactorCode(files[activeTabId].content!, files[activeTabId].language || 'text');
      handleContentChange(result.refactoredCode);
    } catch (error) {
      console.error('Refactoring error:', error);
    } finally {
      setAiWorking(false);
    }
  }, [activeTabId, files, handleContentChange]);

  // Helper function to render icons safely
  const renderIcon = (icon: { component: any; size: number }) => {
    const IconComponent = icon.component;
    if (IconComponent && React.isValidElement(<IconComponent size={icon.size} />)) {
      return <IconComponent size={icon.size} />;
    }
    return <div>⚠️</div>; // Fallback icon
  };

  const activeFile = activeTabId ? files[activeTabId] : null;

  return (
    <div className={`${embedded ? 'h-screen' : 'h-screen'} flex flex-col bg-gradient-to-b from-[#0f111a] to-[#1a1d2e] overflow-hidden`}>
      {/* Top Menu / Header */}
      <div className="h-10 bg-gradient-to-r from-[#1a1d2e] to-[#252a3d] flex items-center justify-between px-3 text-xs text-gray-300 border-b border-[#2a2f45] select-none backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 font-bold bg-gradient-to-r from-[#4ec9b0] to-[#7c3aed] bg-clip-text text-transparent px-2">
            <Sparkles size={18} className="text-[#4ec9b0]" /> <span className="text-sm tracking-wide">LUMINA Studio</span>
          </div>
          <div className="flex space-x-3">
            <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="File Menu">File</button>
            <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="Edit Menu">Edit</button>
            <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="Selection Menu">Selection</button>
            <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="View Menu">View</button>
            <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="Go Menu">Go</button>
            <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="Tools Menu">Tools</button>
          </div>
        </div>
        
        {/* Tools Quick Access */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-2 bg-[#1a1d2e]/80 px-3 py-1.5 rounded-xl border border-[#2a2f45] shadow-xl backdrop-blur-sm">
            {recentTools.slice(0, 4).map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  handleToolSelect(tool);
                  setActiveSidebarView('tools');
                  setSidebarVisible(true);
                  setToolsPanelVisible(true);
                }}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#252a3d] hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#4ec9b0] text-[#a0a5b8] hover:text-white rounded-lg text-xs transition-all duration-300 font-medium shadow-sm hover:shadow-lg hover:scale-105"
                title={tool.name}
              >
                <span className="text-[#7c3aed] group-hover:text-white transition-colors duration-300">
                  {renderIcon(tool.icon)}
                </span>
                <span className="hidden md:inline group-hover:text-white transition-colors duration-200">
                  {tool.shortName}
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowAllTools(!showAllTools)}
              className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-[#7c3aed] to-[#4ec9b0] hover:from-[#6d28d9] hover:to-[#3db8a0] text-white rounded-lg text-xs transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Zap size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 pr-2">
          <button 
            onClick={handleAIExplain}
            disabled={aiWorking}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#4ec9b0] to-[#7c3aed] text-white rounded-lg hover:from-[#3db8a0] hover:to-[#6d28d9] disabled:opacity-50 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-[#4ec9b0]/30"
          >
            <Sparkles size={14} /> <span>Explain</span>
          </button>
          <button 
            onClick={handleAIRefactor}
            disabled={aiWorking}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white rounded-lg hover:from-[#6d28d9] hover:to-[#db2777] disabled:opacity-50 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 border border-[#7c3aed]/30"
          >
            <Wand2 size={14} /> <span>Refactor</span>
          </button>
        </div>
      </div>

      {/* All Tools Dropdown */}
      {showAllTools && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2/3 bg-gradient-to-b from-[#1a1d2e] to-[#252a3d] border border-[#2a2f45] rounded-2xl shadow-2xl z-50 p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg bg-gradient-to-r from-[#4ec9b0] to-[#7c3aed] bg-clip-text text-transparent">Tools</h3>
            <button onClick={() => setShowAllTools(false)} className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-white hover:bg-[#7c3aed] rounded-lg transition-all duration-200">
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TOOL_CATEGORIES.flatMap(category => category.tools).map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  handleToolSelect(tool);
                  setShowAllTools(false);
                }}
                className="group flex flex-col items-center p-4 bg-[#252a3d] hover:bg-gradient-to-br hover:from-[#7c3aed] hover:to-[#4ec9b0] hover:scale-105 text-[#a0a5b8] hover:text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-xl border border-[#2a2f45] hover:border-transparent"
              >
                <div className="text-[#7c3aed] mb-2 group-hover:text-white transition-colors duration-300">{renderIcon(tool.icon)}</div>
                <span className="text-white text-xs font-medium group-hover:text-white">{tool.name}</span>
                <span className="text-gray-400 text-[10px] mt-1 group-hover:text-gray-200">{tool.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar 
          activeView={activeSidebarView} 
          setActiveView={setActiveSidebarView}
          sidebarVisible={sidebarVisible}
          toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
          onToolClick={() => {
            setActiveSidebarView('tools');
            setSidebarVisible(true);
          }}
        />

        {/* Sidebar */}
        {sidebarVisible && (
          <div className="w-72 bg-gradient-to-b from-[#1a1d2e] to-[#0f111a] border-r border-[#2a2f45] flex flex-col">
            {activeSidebarView === 'explorer' ? (
              <FileExplorer 
                files={files} 
                onSelect={handleFileSelect} 
                onCreate={handleCreateFile}
                onDelete={handleDeleteFile}
                activeFileId={activeTabId}
              />
            ) : activeSidebarView === 'search' ? (
              <SearchView
                files={files}
                onOpenMatch={handleOpenSearchMatch}
              />
            ) : activeSidebarView === 'ai_chat' ? (
              <AIChatView />
            ) : activeSidebarView === 'tools' ? (
              <ToolsPanel 
                onToolSelect={handleToolSelect}
                recentTools={recentTools}
                categories={TOOL_CATEGORIES}
              />
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm italic">
                {activeSidebarView.charAt(0).toUpperCase() + activeSidebarView.slice(1)} view not implemented.
              </div>
            )}
          </div>
        )}

        {/* Tools Panel */}
        {toolsPanelVisible && activeTool && (
          <ToolsPanel 
            activeTool={activeTool}
            onClose={() => setToolsPanelVisible(false)}
            onAction={handleToolAction}
            isDocked={false}
          />
        )}

        {/* Editor Area */}
        <div className={`flex-1 flex flex-col overflow-hidden ${toolsPanelVisible ? 'mr-80' : ''}`}>
          {/* Tabs */}
          <div className="flex bg-[#252526] overflow-x-auto no-scrollbar border-b border-[#1e1e1e]">
            {openTabIds.map(tid => {
              const f = files[tid];
              return (
                <div
                  key={tid}
                  onClick={() => setActiveTabId(tid)}
                  className={`group min-w-[120px] max-w-[200px] h-9 flex items-center px-3 cursor-pointer border-r border-[#1e1e1e] select-none text-xs transition-all duration-200 ${
                    activeTabId === tid 
                      ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' 
                      : 'bg-[#2d2d2d] text-gray-500 hover:bg-[#333333] hover:text-white'
                  }`}
                >
                  <FileCode size={14} className="mr-2 text-[#007acc]" />
                  <span className="truncate flex-1">{f.name}</span>
                  <button 
                    onClick={(e) => closeTab(tid, e)}
                    className="ml-2 p-0.5 rounded hover:bg-[#444] hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
            {openTabIds.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-600 text-[10px] italic">
                No files open
              </div>
            )}
          </div>

          {/* Breadcrumbs with Tools */}
          {activeFile && (
            <div className="bg-[#1e1e1e] h-8 flex items-center justify-between px-4 text-[11px] text-gray-500 border-b border-[#1e1e1e]">
              <div className="flex items-center space-x-1">
                <FolderOpen size={12} />
                <span>my-project</span>
                <span>&gt;</span>
                <span className="text-gray-300 font-medium">{activeFile.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleToolAction('formatCode')}
                  className="group flex items-center gap-1 px-2 py-1 bg-[#252526] hover:bg-[#007acc] text-[#cccccc] hover:text-white rounded text-[10px] transition-all duration-200"
                >
                  <Layout size={12} className="group-hover:text-white" /> <span className="group-hover:text-white">Format</span>
                </button>
                <button 
                  onClick={() => handleToolSelect(RECENT_TOOLS[0])}
                  className="group flex items-center gap-1 px-2 py-1 bg-[#252526] hover:bg-[#007acc] text-[#cccccc] hover:text-white rounded text-[10px] transition-all duration-200"
                >
                  <Eye size={12} className="group-hover:text-white" /> <span className="group-hover:text-white">Preview</span>
                </button>
                <button 
                  onClick={() => handleToolAction('generateTest')}
                  className="group flex items-center gap-1 px-2 py-1 bg-[#252526] hover:bg-[#007acc] text-[#cccccc] hover:text-white rounded text-[10px] transition-all duration-200"
                >
                  <Bug size={12} className="group-hover:text-white" /> <span className="group-hover:text-white">Test</span>
                </button>
              </div>
            </div>
          )}

          {/* Editor Container */}
          <div className="flex-1 relative bg-gradient-to-br from-[#0f111a] to-[#1a1d2e]">
            {activeFile ? (
              <CodeEditor 
                content={activeFile.content || ''}
                language={activeFile.language || 'typescript'}
                onChange={handleContentChange}
                onMount={(editor) => { editorRef.current = editor; }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-50 select-none">
                <Sparkles size={100} className="text-[#7c3aed]" />
                <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#4ec9b0] to-[#7c3aed] bg-clip-text text-transparent">LUMINA Code Studio</div>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="text-right text-gray-400">Open File</div><div className="text-gray-200">Ctrl + O</div>
                  <div className="text-right text-gray-400">Search</div><div className="text-gray-200">Ctrl + Shift + F</div>
                  <div className="text-right text-gray-400">AI Chat</div><div className="text-gray-200">Ctrl + G</div>
                  <div className="text-right text-gray-400">Tools</div><div className="text-gray-200">Ctrl + T</div>
                </div>
                
                {/* Quick Tool Access */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {RECENT_TOOLS.slice(0, 3).map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className="group flex flex-col items-center p-4 bg-[#252a3d] hover:bg-gradient-to-br hover:from-[#7c3aed] hover:to-[#4ec9b0] hover:text-white rounded-xl transition-all duration-300 border border-[#2a2f45] hover:border-transparent hover:scale-105"
                    >
                      <div className="text-[#7c3aed] mb-2 group-hover:text-white transition-colors duration-300">{renderIcon(tool.icon)}</div>
                      <span className="text-white text-sm group-hover:text-white">{tool.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Action Floaties */}
            {activeFile && (
              <div className="absolute bottom-4 right-8 flex gap-2">
                <button 
                  onClick={() => setTerminalVisible(!terminalVisible)}
                  className="flex items-center justify-center bg-[#252a3d] hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#4ec9b0] text-gray-300 hover:text-white p-3 rounded-full shadow-xl border border-[#2a2f45] hover:border-transparent transition-all duration-300 hover:scale-110"
                  title="Toggle Terminal"
                >
                  <TerminalIcon size={20} />
                </button>
                <button 
                  onClick={() => setToolsPanelVisible(!toolsPanelVisible)}
                  className="flex items-center justify-center bg-gradient-to-r from-[#7c3aed] to-[#4ec9b0] hover:from-[#6d28d9] hover:to-[#3db8a0] text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                  title="Tools Panel"
                >
                  <Zap size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Terminal */}
          {terminalVisible && (
            <Terminal onClose={() => setTerminalVisible(false)} />
          )}
        </div>
      </div>

      {/* Footer / Status Bar with Tool Status */}
      <StatusBar 
        language={activeFile?.language} 
        toolStatus={activeTool ? `Active: ${activeTool.name}` : 'Ready'}
      />

      <QuickOpenModal
        isOpen={quickOpenVisible}
        files={files}
        openTabIds={openTabIds}
        onOpenFile={handleFileSelect}
        onClose={() => setQuickOpenVisible(false)}
      />
    </div>
  );
};

export default Index;