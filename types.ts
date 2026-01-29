import React from 'react';

export type FileType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content?: string;
  language?: string;
  isOpen?: boolean;
}

export interface Tab {
  fileId: string;
  isDirty: boolean;
}

export type SidebarView =
  | 'explorer'
  | 'ai_chat'
  | 'tools'
  | 'search'
  | 'git'
  | 'debug'
  | 'extensions';

export interface EditorState {
  files: Record<string, FileNode>;
  activeTabId: string | null;
  openTabIds: string[];
  sidebarVisible: boolean;
  activeSidebarView: SidebarView;
  theme: 'dark' | 'light';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ToolAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  data?: any;
}

export interface Tool {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  actions?: ToolAction[];
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  tools: Tool[];
}
