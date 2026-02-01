import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    X, FileCode, Terminal as TerminalIcon,
    Sparkles, Wand2, Zap, FolderOpen
} from 'lucide-react';
import ActivityBar from './ActivityBar';
import FileExplorer from './FileExplorer';
import CodeEditor from './Editor';
import StatusBar from './StatusBar';
import AIChatView from './AIChatView';
import Terminal from './Terminal';
import ToolsPanel from './ToolsPanel';
import QuickOpenModal from './QuickOpenModal';
import SearchView, { SearchMatch } from './SearchView';
import { FileNode, SidebarView, Tool } from '../types';
import { INITIAL_FILES, TOOL_CATEGORIES, RECENT_TOOLS } from '../constants';
import { useEditorStore, useUIStore, useFileSystemStore, useTerminalStore } from '../store';
import {
    explainCode,
    refactorCode,
    generateCodeFromPrompt
} from '../services/geminiService';

type PendingLocation = {
    fileId: string;
    lineNumber: number;
    column: number;
    length: number;
};

const CodeEditorLayout: React.FC = () => {
    // Editor store - file management and editor state
    const {
        files: storeFiles, openTabs, activeTabId, currentLine, currentColumn,
        addFile, updateFile, deleteFile, openFile, closeFile, setActiveTab,
        setCursorPosition
    } = useEditorStore();

    // UI store - layout and modal states
    const {
        sidebarVisible, toggleSidebar, commandPaletteOpen, toggleCommandPalette,
        quickOpenOpen, toggleQuickOpen, searchPanelOpen, toggleSearchPanel,
        goToLineOpen, toggleGoToLine, keyboardShortcutsOpen, toggleKeyboardShortcuts,
        activeSidebarView, setActiveSidebarView, panelVisible, setActivePanel
    } = useUIStore();

    // File system store - file tree management
    const { files: fileSystemFiles, createFile, createFolder, deleteFile: deleteFileSystemFile } = useFileSystemStore();

    // Terminal store - terminal state
    const { terminalVisible: terminalVisibleFromStore, toggleTerminal } = useTerminalStore();

    const [files, setFiles] = useState<Record<string, FileNode>>(INITIAL_FILES);
    const [aiWorking, setAiWorking] = useState(false);
    const [toolsPanelVisible, setToolsPanelVisible] = useState(false);
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [recentTools, setRecentTools] = useState<Tool[]>(RECENT_TOOLS);
    const [showAllTools, setShowAllTools] = useState(false);
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
                toggleQuickOpen();
                return;
            }

            if (ctrlOrMeta && e.shiftKey && key === 'f') {
                e.preventDefault();
                setActiveSidebarView('search' as any);
                toggleSidebar();
                return;
            }

            if (ctrlOrMeta && e.key === '`') {
                e.preventDefault();
                toggleTerminal();
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, []);

    const handleFileSelect = useCallback((id: string) => {
        openFile(id);
    }, [openFile]);

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
        closeFile(id);
    }, [closeFile]);

    const handleCreateFile = useCallback((parentId: string, type: 'file' | 'folder') => {
        const name = prompt(`Enter ${type} name:`);
        if (!name) return;

        if (type === 'file') {
            createFile(parentId, name);
        } else {
            createFolder(parentId, name);
        }
    }, [createFile, createFolder]);

    const handleDeleteFile = useCallback((id: string) => {
        if (id === 'root') return;
        if (!confirm('Are you sure you want to delete this?')) return;

        deleteFileSystemFile(id);
    }, [deleteFileSystemFile]);

    const handleContentChange = useCallback((value: string | undefined) => {
        if (activeTabId && value !== undefined) {
            updateFile(activeTabId, value);
        }
    }, [activeTabId, updateFile]);

    const handleToolSelect = useCallback((tool: Tool) => {
        setActiveTool(tool);
        setToolsPanelVisible(true);

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

            default:
                console.log(`Action ${action} triggered`);
        }
    }, [activeTabId, files, handleContentChange, handleFileSelect]);

    const handleAIExplain = useCallback(async () => {
        if (!activeTabId || !files[activeTabId]?.content) return;
        setAiWorking(true);
        setActiveSidebarView('ai_chat' as any);
        toggleSidebar();

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

    const renderIcon = (icon: React.ReactNode) => {
        if (React.isValidElement(icon)) {
            return icon;
        }
        return <div>⚠️</div>;
    };

    const activeFile = activeTabId ? storeFiles[activeTabId] : null;

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-[#0f111a] to-[#1a1d2e] overflow-hidden">
            {/* Top Menu / Header */}
            <div className="h-10 bg-gradient-to-r from-[#1a1d2e] to-[#252a3d] flex items-center justify-between px-3 text-xs text-gray-300 border-b border-[#2a2f45] select-none backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2 font-bold bg-gradient-to-r from-[#4ec9b0] to-[#7c3aed] bg-clip-text text-transparent px-2">
                        <Sparkles size={18} className="text-[#4ec9b0]" /> <span className="text-sm tracking-wide">LUMINA Studio</span>
                    </div>
                    <div className="flex space-x-3">
                        <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="File Menu">File</button>
                        <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="Edit Menu">Edit</button>
                        <button className="hover:bg-[#7c3aed]/20 hover:text-[#a78bfa] px-3 py-1.5 rounded-md transition-all duration-200 font-medium" title="View Menu">View</button>
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

            {/* Main Body */}
            <div className="flex-1 flex overflow-hidden">
                <ActivityBar
                    activeView={activeSidebarView as any}
                    setActiveView={setActiveSidebarView as any}
                    sidebarVisible={sidebarVisible}
                    toggleSidebar={toggleSidebar}
                    onToolClick={() => {
                        setActiveSidebarView('tools' as any);
                        toggleSidebar();
                    }}
                />

                {/* Sidebar */}
                {sidebarVisible && (
                    <div className="w-72 bg-gradient-to-b from-[#1a1d2e] to-[#0f111a] border-r border-[#2a2f45] flex flex-col">
                        {activeSidebarView === 'explorer' ? (
                            <FileExplorer
                                files={fileSystemFiles as any}
                                onSelect={handleFileSelect}
                                onCreate={handleCreateFile}
                                onDelete={handleDeleteFile}
                                activeFileId={activeTabId}
                            />
                        ) : activeSidebarView === 'search' ? (
                            <SearchView
                                files={fileSystemFiles as any}
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
                        {openTabs.map(tid => {
                            const f = storeFiles[tid];
                            return (
                                <div
                                    key={tid}
                                    onClick={() => setActiveTab(tid)}
                                    className={`group min-w-[120px] max-w-[200px] h-9 flex items-center px-3 cursor-pointer border-r border-[#1e1e1e] select-none text-xs transition-all duration-200 ${activeTabId === tid
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
                        {openTabs.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-gray-600 text-[10px] italic">
                                No files open
                            </div>
                        )}
                    </div>

                    {/* Breadcrumbs */}
                    {activeFile && (
                        <div className="bg-[#1e1e1e] h-8 flex items-center justify-between px-4 text-[11px] text-gray-500 border-b border-[#1e1e1e]">
                            <div className="flex items-center space-x-1">
                                <FolderOpen size={12} />
                                <span>my-project</span>
                                <span>&gt;</span>
                                <span className="text-gray-300 font-medium">{activeFile.name}</span>
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
                                    <div className="text-right text-gray-400">Terminal</div><div className="text-gray-200">Ctrl + `</div>
                                </div>
                            </div>
                        )}

                        {/* AI Action Floaties */}
                        {activeFile && (
                            <div className="absolute bottom-4 right-8 flex gap-2">
                                <button
                                    onClick={toggleTerminal}
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
                    {terminalVisibleFromStore && (
                        <Terminal onClose={toggleTerminal} />
                    )}
                </div>
            </div>

            {/* Footer / Status Bar */}
            <StatusBar
                language={activeFile?.language}
                toolStatus={activeTool ? `Active: ${activeTool.name}` : 'Ready'}
            />

            <QuickOpenModal
                isOpen={quickOpenOpen}
                files={fileSystemFiles as any}
                openTabIds={openTabs}
                onOpenFile={handleFileSelect}
                onClose={toggleQuickOpen}
            />
        </div>
    );
};

export default CodeEditorLayout;
