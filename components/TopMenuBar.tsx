import React, { useEffect, useCallback } from 'react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
} from './ui/menubar';
import {
    Sparkles,
    FileText,
    FolderOpen,
    Save,
    X,
    Undo,
    Redo,
    Scissors,
    Copy,
    Clipboard,
    Search,
    Hash,
    Layout,
    Eye,
    Play,
    Terminal as TerminalIcon,
    HelpCircle,
    User,
    Info,
    Settings,
    Wand2
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { useUIStore } from '../store/uiStore';
import { useFileSystemStore } from '../store/fileSystemStore';
import { useTerminalStore } from '../store/terminalStore';

interface TopMenuBarProps {
    onAIExplain?: () => void;
    onAIRefactor?: () => void;
    aiWorking?: boolean;
}

export function TopMenuBar({ onAIExplain, onAIRefactor, aiWorking }: TopMenuBarProps) {
    const {
        activeTabId,
        files: storeFiles,
        saveFiles,
        closeFile,
        addFile,
        openFile
    } = useEditorStore();

    const {
        sidebarVisible,
        toggleSidebar,
        toggleStatusBar,
        togglePanel,
        toggleCommandPalette,
        toggleSearchPanel,
        openGoToLine,
        openKeyboardShortcuts,
        openSettingsPanel
    } = useUIStore();

    const { requestFileSystemAccess } = useFileSystemStore();
    const { createSession, toggleTerminal, terminalVisible, clearSession, clearAllSessions } = useTerminalStore();

    // Enhanced keyboard shortcuts
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Ctrl+` - Toggle Terminal
        if (event.ctrlKey && event.key === '`') {
            event.preventDefault();
            toggleTerminal();
        }
        
        // Ctrl+Shift+` - New Terminal
        if (event.ctrlKey && event.shiftKey && event.key === '`') {
            event.preventDefault();
            createSession();
            if (!terminalVisible) toggleTerminal();
        }
        
        // Ctrl+J - Focus Terminal
        if (event.ctrlKey && event.key === 'j') {
            event.preventDefault();
            if (!terminalVisible) {
                toggleTerminal();
            }
            // Focus the active terminal session
            const { activeSessionId, setSessionFocused } = useTerminalStore.getState();
            if (activeSessionId) {
                setSessionFocused(activeSessionId, true);
            }
        }
        
        // Ctrl+\ - Split Terminal
        if (event.ctrlKey && event.key === '\\') {
            event.preventDefault();
            const sessionId = createSession('Split Terminal');
            if (!terminalVisible) toggleTerminal();
        }
    }, [toggleTerminal, createSession, terminalVisible]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleNewFile = () => {
        const id = `file-${Date.now()}`;
        const name = `untitled-${Date.now()}.txt`;
        const newFile = {
            id,
            name,
            path: `/${name}`,
            content: '',
            language: 'plaintext',
            isDirty: false,
            isOpen: true,
            lastModified: Date.now(),
            encoding: 'utf-8',
            lineEnding: 'LF' as const,
            indentSize: 4,
            indentUsingSpaces: true,
            trimWhitespace: true
        };
        addFile(newFile);
        openFile(id);
    };

    return (
        <Menubar className="h-10 bg-[#1a1a1a] border-b border-[#333333] rounded-none px-4 flex items-center select-none z-50">
            {/* Logo Part */}
            <div className="flex items-center gap-2 mr-6 font-bold text-[#00d9ff]">
                <Sparkles size={18} />
                <span className="text-sm tracking-wide uppercase">Lumina Studio</span>
            </div>

            {/* FILE MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">File</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem onClick={handleNewFile} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <FileText className="mr-2 h-4 w-4" /> New File <MenubarShortcut>Ctrl+N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => {/* Toggle New Folder dialog */ }} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        New Folder
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => {/* UI logic for Open File */ }} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Open File... <MenubarShortcut>Ctrl+O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => requestFileSystemAccess()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <FolderOpen className="mr-2 h-4 w-4" /> Open Folder... <MenubarShortcut>Ctrl+K Ctrl+O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSub>
                        <MenubarSubTrigger className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Open Recent</MenubarSubTrigger>
                        <MenubarSubContent className="bg-[#1e1e1e] border-[#333333]">
                            <MenubarItem disabled>No Recent Files</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => saveFiles()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Save className="mr-2 h-4 w-4" /> Save <MenubarShortcut>Ctrl+S</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => saveFiles()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Save All
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Auto Save <MenubarShortcut>Checked</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => activeTabId && closeFile(activeTabId)} className="hover:bg-[#333333]">
                        Close Editor <MenubarShortcut>Ctrl+W</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => {/* Close Folder Logic */ }} className="hover:bg-[#333333]">
                        Close Folder
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="text-red-400 hover:bg-red-400/10">Exit Workspace</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* EDIT MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">Edit</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Undo className="mr-2 h-4 w-4" /> Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Redo className="mr-2 h-4 w-4" /> Redo <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Scissors className="mr-2 h-4 w-4" /> Cut <MenubarShortcut>Ctrl+X</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Copy className="mr-2 h-4 w-4" /> Copy <MenubarShortcut>Ctrl+C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Clipboard className="mr-2 h-4 w-4" /> Paste <MenubarShortcut>Ctrl+V</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => toggleSearchPanel()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Search className="mr-2 h-4 w-4" /> Find <MenubarShortcut>Ctrl+F</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => toggleSearchPanel()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Replace <MenubarShortcut>Ctrl+H</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Toggle Line Comment <MenubarShortcut>Ctrl+/</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Format Document <MenubarShortcut>Alt+Shift+F</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* SELECTION MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">Selection</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Select All <MenubarShortcut>Ctrl+A</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Expand Selection <MenubarShortcut>Alt+Shift+Right</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Shrink Selection <MenubarShortcut>Alt+Shift+Left</MenubarShortcut></MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Add Cursor Above <MenubarShortcut>Ctrl+Alt+Up</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Add Cursor Below <MenubarShortcut>Ctrl+Alt+Down</MenubarShortcut></MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Select All Occurrences <MenubarShortcut>Ctrl+Shift+L</MenubarShortcut></MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* VIEW MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">View</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem onClick={() => toggleSidebar()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Layout className="mr-2 h-4 w-4" /> Toggle Sidebar <MenubarShortcut>Ctrl+B</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => toggleStatusBar()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Toggle Status Bar
                    </MenubarItem>
                    <MenubarItem onClick={() => toggleTerminal()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <TerminalIcon className="mr-2 h-4 w-4" /> Toggle Terminal <MenubarShortcut>Ctrl+`</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => {
                        // Focus terminal
                        if (!terminalVisible) {
                            toggleTerminal();
                        }
                        // Focus the active terminal session
                        const { activeSessionId, setSessionFocused } = useTerminalStore.getState();
                        if (activeSessionId) {
                            setSessionFocused(activeSessionId, true);
                        }
                    }} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Focus Terminal <MenubarShortcut>Ctrl+J</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => toggleCommandPalette()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Command Palette... <MenubarShortcut>Ctrl+Shift+P</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Full Screen <MenubarShortcut>F11</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Zen Mode <MenubarShortcut>Ctrl+K Z</MenubarShortcut></MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* GO MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">Go</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem onClick={() => toggleCommandPalette()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Go to File... <MenubarShortcut>Ctrl+P</MenubarShortcut></MenubarItem>
                    <MenubarItem onClick={() => openGoToLine()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Go to Line... <MenubarShortcut>Ctrl+G</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Go to Symbol... <MenubarShortcut>Ctrl+Shift+O</MenubarShortcut></MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Go to Definition <MenubarShortcut>F12</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Go Back <MenubarShortcut>Alt+Left</MenubarShortcut></MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Go Forward <MenubarShortcut>Alt+Right</MenubarShortcut></MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* RUN MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">Run</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Play className="mr-2 h-4 w-4" /> Start Debugging <MenubarShortcut>F5</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Run Without Debugging <MenubarShortcut>Ctrl+F5</MenubarShortcut></MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Run Task...</MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Build Task... <MenubarShortcut>Ctrl+Shift+B</MenubarShortcut></MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* TERMINAL MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">Terminal</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem onClick={() => createSession()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <TerminalIcon className="mr-2 h-4 w-4" /> New Terminal <MenubarShortcut>Ctrl+Shift+`</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => {
                        // Split terminal functionality
                        const sessionId = createSession('Split Terminal');
                        if (!terminalVisible) toggleTerminal();
                    }} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Split Terminal <MenubarShortcut>Ctrl+\</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => {
                        // Clear active terminal session
                        const { activeSessionId } = useTerminalStore.getState();
                        if (activeSessionId) clearSession(activeSessionId);
                    }} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Clear Terminal
                    </MenubarItem>
                    <MenubarItem onClick={() => clearAllSessions()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        Clear All Terminals
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* HELP MENU */}
            <MenubarMenu>
                <MenubarTrigger className="data-[state=open]:bg-[#333333] hover:bg-[#333333] text-gray-300 px-3 h-8 text-xs cursor-pointer">Help</MenubarTrigger>
                <MenubarContent className="bg-[#1e1e1e] border-[#333333] text-gray-300 min-w-[200px]">
                    <MenubarItem onClick={() => openKeyboardShortcuts()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Layout className="mr-2 h-4 w-4" /> Keyboard Shortcuts <MenubarShortcut>Ctrl+K Ctrl+S</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Info className="mr-2 h-4 w-4" /> Documentation
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem onClick={() => openSettingsPanel()} className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">
                        <Settings className="mr-2 h-4 w-4" /> Settings <MenubarShortcut>Ctrl+,</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">Report Issue</MenubarItem>
                    <MenubarSeparator className="bg-[#333333]" />
                    <MenubarItem className="hover:bg-[#00d9ff] hover:text-[#1a1a1a]">About LUMINA STUDIO</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* Right side spacer */}
            <div className="flex-1" />

            {/* AI Actions */}
            <div className="flex items-center gap-2 mr-4">
                <button
                    onClick={onAIExplain}
                    disabled={aiWorking}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#00d9ff]/10 text-[#00d9ff] hover:bg-[#00d9ff] hover:text-[#1a1a1a] transition-all duration-200 text-[10px] font-bold uppercase tracking-wider rounded border border-[#00d9ff]/20 disabled:opacity-50"
                >
                    <Sparkles size={12} /> Explain
                </button>
                <button
                    onClick={onAIRefactor}
                    disabled={aiWorking}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#a78bfa]/10 text-[#a78bfa] hover:bg-[#a78bfa] hover:text-[#1a1a1a] transition-all duration-200 text-[10px] font-bold uppercase tracking-wider rounded border border-[#a78bfa]/20 disabled:opacity-50"
                >
                    <Wand2 className="h-3 w-3" /> Refactor
                </button>
            </div>

            {/* User Profile / Status */}
            <div className="flex items-center gap-4 text-gray-400">
                {/* Terminal Status Indicator */}
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${terminalVisible ? 'bg-[#00d9ff] animate-pulse' : 'bg-gray-600'}`} />
                    <span className="text-[10px] font-medium uppercase tracking-wider">
                        {terminalVisible ? 'Terminal Active' : 'Terminal'}
                    </span>
                </div>
                
                <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                    <User size={14} />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Guest</span>
                </div>
            </div>
        </Menubar>
    );
}

export default TopMenuBar;
