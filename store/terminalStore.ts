import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TerminalSession {
  id: string;
  name: string;
  isActive: boolean;
  isFocused: boolean;
  history: string[];
  currentInput: string;
  cursorPosition: number;
  process?: {
    name: string;
    args: string[];
    pid: number;
    status: 'running' | 'completed' | 'error';
    exitCode?: number;
  };
}

export interface TerminalState {
  // Terminal state
  sessions: Record<string, TerminalSession>;
  activeSessionId: string | null;
  terminalVisible: boolean;
  terminalHeight: number; // in pixels or rows
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  cursorColor: string;
  
  // Session operations
  createSession: (name?: string) => string;
  deleteSession: (id: string) => void;
  setActiveSession: (id: string) => void;
  setSessionFocused: (id: string, focused: boolean) => void;
  renameSession: (id: string, name: string) => void;
  
  // Terminal operations
  toggleTerminal: () => void;
  setTerminalHeight: (height: number) => void;
  clearSession: (id: string) => void;
  clearAllSessions: () => void;
  
  // Command operations
  executeCommand: (sessionId: string, command: string) => void;
  addToHistory: (sessionId: string, output: string) => void;
  setCurrentInput: (sessionId: string, input: string) => void;
  setCursorPosition: (sessionId: string, position: number) => void;
  
  // Process management
  startProcess: (sessionId: string, name: string, args: string[]) => void;
  endProcess: (sessionId: string, exitCode?: number) => void;
  killProcess: (sessionId: string) => void;
  
  // Appearance
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  setBackgroundColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setCursorColor: (color: string) => void;
  
  // Integration with external terminals
  isXTermAvailable: boolean;
  initializeXTerm: () => Promise<boolean>;
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: {},
      activeSessionId: null,
      terminalVisible: false,
      terminalHeight: 300,
      fontSize: 14,
      fontFamily: "'IBM Plex Mono', monospace",
      backgroundColor: '#1a1a1a',
      textColor: '#f5f5f5',
      cursorColor: '#00d9ff',
      isXTermAvailable: false,
      
      // Create new terminal session
      createSession: (name = 'Terminal') => {
        const id = `terminal-${Date.now()}`;
        const newSession: TerminalSession = {
          id,
          name: `${name} ${Object.keys(get().sessions).length + 1}`,
          isActive: false,
          isFocused: false,
          history: [],
          currentInput: '',
          cursorPosition: 0
        };
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [id]: newSession
          },
          activeSessionId: state.activeSessionId || id
        }));
        
        return id;
      },
      
      // Delete terminal session
      deleteSession: (id) => {
        const { sessions, activeSessionId } = get();
        const sessionCount = Object.keys(sessions).length;
        
        if (sessionCount <= 1) return; // Don't delete the last session
        
        const newSessions = { ...sessions };
        delete newSessions[id];
        
        // Set new active session if we deleted the active one
        let newActiveSessionId = activeSessionId;
        if (activeSessionId === id) {
          newActiveSessionId = Object.keys(newSessions)[0] || null;
        }
        
        set({
          sessions: newSessions,
          activeSessionId: newActiveSessionId
        });
      },
      
      // Set active session
      setActiveSession: (id) => {
        const { sessions } = get();
        if (!sessions[id]) return;
        
        set(state => ({
          activeSessionId: id,
          sessions: {
            ...state.sessions,
            [id]: { ...sessions[id], isActive: true },
            // Deactivate all other sessions
            ...Object.fromEntries(
              Object.entries(state.sessions)
                .filter(([sessionId]) => sessionId !== id)
                .map(([sessionId, session]) => [sessionId, { ...session, isActive: false }])
            )
          }
        }));
      },
      
      // Set session focus
      setSessionFocused: (id, focused) => {
        const { sessions } = get();
        if (!sessions[id]) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [id]: { ...sessions[id], isFocused: focused },
            // Unfocus all other sessions
            ...Object.fromEntries(
              Object.entries(state.sessions)
                .filter(([sessionId]) => sessionId !== id)
                .map(([sessionId, session]) => [sessionId, { ...session, isFocused: false }])
            )
          }
        }));
      },
      
      // Rename session
      renameSession: (id, name) => {
        const { sessions } = get();
        if (!sessions[id]) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [id]: { ...sessions[id], name }
          }
        }));
      },
      
      // Toggle terminal visibility
      toggleTerminal: () => {
        set(state => ({ terminalVisible: !state.terminalVisible }));
      },
      
      // Set terminal height
      setTerminalHeight: (height) => {
        set({ terminalHeight: Math.max(100, Math.min(600, height)) });
      },
      
      // Clear session history
      clearSession: (id) => {
        const { sessions } = get();
        if (!sessions[id]) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [id]: {
              ...sessions[id],
              history: [],
              currentInput: '',
              cursorPosition: 0,
              process: undefined
            }
          }
        }));
      },
      
      // Clear all sessions
      clearAllSessions: () => {
        const { sessions } = get();
        
        set(state => ({
          sessions: Object.fromEntries(
            Object.entries(sessions).map(([id, session]) => [
              id,
              {
                ...session,
                history: [],
                currentInput: '',
                cursorPosition: 0,
                process: undefined
              }
            ])
          )
        }));
      },
      
      // Execute command
      executeCommand: (sessionId, command) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session) return;
        
        // Add command to history
        const timestamp = new Date().toLocaleTimeString();
        const commandEntry = `$ ${command}`;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              history: [...session.history, commandEntry],
              currentInput: '',
              cursorPosition: 0
            }
          }
        }));
        
        // Simulate command execution (in real implementation, this would use WebContainer or backend)
        setTimeout(() => {
          get().addToHistory(sessionId, `Command executed: ${command}`);
          get().endProcess(sessionId, 0);
        }, 100);
        
        // Start process
        get().startProcess(sessionId, command.split(' ')[0], command.split(' ').slice(1));
      },
      
      // Add output to history
      addToHistory: (sessionId, output) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              history: [...session.history, output]
            }
          }
        }));
      },
      
      // Set current input
      setCurrentInput: (sessionId, input) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              currentInput: input,
              cursorPosition: input.length
            }
          }
        }));
      },
      
      // Set cursor position
      setCursorPosition: (sessionId, position) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              cursorPosition: Math.max(0, Math.min(session.currentInput.length, position))
            }
          }
        }));
      },
      
      // Start process
      startProcess: (sessionId, name, args) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session) return;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              process: {
                name,
                args,
                pid: Math.floor(Math.random() * 10000),
                status: 'running'
              }
            }
          }
        }));
      },
      
      // End process
      endProcess: (sessionId, exitCode = 0) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session || !session.process) return;
        
        const process = session.process;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              process: {
                name: process.name,
                args: process.args,
                pid: process.pid,
                status: exitCode === 0 ? 'completed' : 'error',
                exitCode
              }
            }
          }
        }));
      },
      
      // Kill process
      killProcess: (sessionId) => {
        const { sessions } = get();
        const session = sessions[sessionId];
        if (!session || !session.process) return;
        
        const process = session.process;
        
        set(state => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              process: {
                name: process.name,
                args: process.args,
                pid: process.pid,
                status: 'error',
                exitCode: 1
              }
            }
          }
        }));
        
        get().addToHistory(sessionId, `Process ${process.pid} killed`);
      },
      
      // Appearance settings
      setFontSize: (size) => {
        set({ fontSize: Math.max(10, Math.min(24, size)) });
      },
      
      setFontFamily: (family) => {
        set({ fontFamily: family });
      },
      
      setBackgroundColor: (color) => {
        set({ backgroundColor: color });
      },
      
      setTextColor: (color) => {
        set({ textColor: color });
      },
      
      setCursorColor: (color) => {
        set({ cursorColor: color });
      },
      
      // Initialize xterm.js
      initializeXTerm: async () => {
        try {
          // Check if xterm.js is available
          if (typeof window !== 'undefined') {
            // In a real implementation, this would dynamically import xterm
            // For now, we'll simulate it
            const xtermAvailable = true; // await import('xterm')
            set({ isXTermAvailable: xtermAvailable });
            return xtermAvailable;
          }
          return false;
        } catch (error) {
          console.error('Failed to initialize xterm:', error);
          set({ isXTermAvailable: false });
          return false;
        }
      }
    }),
    {
      name: 'lumina-terminal',
      partialize: (state) => ({
        terminalVisible: state.terminalVisible,
        terminalHeight: state.terminalHeight,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        backgroundColor: state.backgroundColor,
        textColor: state.textColor,
        cursorColor: state.cursorColor
      })
    }
  )
);
