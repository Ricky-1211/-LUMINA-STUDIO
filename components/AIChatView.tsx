import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, Trash2, Sparkles, Copy, Check, Download, Upload, Code, History, Bug, Plus, Wand2, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithGemini } from '../services/geminiService';

interface ChatHistory {
  id: string;
  name: string;
  messages: ChatMessage[];
  timestamp: number;
}

const AIChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m LUMINA AI, your coding assistant. How can I help you today? You can ask me to explain code, refactor it, debug issues, or generate new code.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const saved = localStorage.getItem('lumina-chat-histories');
    if (saved) {
      try {
        setChatHistories(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat histories", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina-chat-histories', JSON.stringify(chatHistories));
  }, [chatHistories]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithGemini([...messages, userMsg]);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check your API configuration.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (messages.length > 1) {
      saveCurrentChat();
    }
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m LUMINA AI, your coding assistant. How can I help you today?',
        timestamp: Date.now()
      }
    ]);
  };

  const saveCurrentChat = () => {
    if (messages.length <= 1) return; // Don't save empty or welcome-only chats
    
    const newHistory: ChatHistory = {
      id: Date.now().toString(),
      name: `Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      messages: messages,
      timestamp: Date.now()
    };
    
    setChatHistories(prev => [newHistory, ...prev].slice(0, 10)); // Keep last 10 chats
  };

  const loadChatHistory = (history: ChatHistory) => {
    setMessages(history.messages);
    setShowHistory(false);
  };

  const deleteChatHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistories(prev => prev.filter(h => h.id !== id));
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setInput('');
    }
  }, [input, isTyping]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const processMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#2d2d2d] text-[#dcdcaa] px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full bg-[#252526]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1e1e1e] bg-gradient-to-r from-[#252526] to-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-[#007acc] to-[#4ec9b0] rounded-lg">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              LUMINA AI Chat
              <span className="text-xs font-normal bg-[#007acc] text-white px-2 py-0.5 rounded-full">Beta</span>
            </h3>
            <p className="text-[10px] text-gray-400">Powered by Gemini AI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="group p-2 hover:bg-[#007acc] rounded transition-all duration-200 text-gray-400 hover:text-white"
            title="Chat History"
          >
            <History size={16} />
          </button>
          <button
            onClick={clearChat}
            className="group p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-all duration-200 text-gray-400"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Chat History Panel */}
      {showHistory && chatHistories.length > 0 && (
        <div className="absolute left-64 top-16 w-72 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl z-10">
          <div className="p-3 border-b border-[#333]">
            <h4 className="text-sm font-semibold text-white">Chat History</h4>
            <p className="text-xs text-gray-400">Select a chat to load</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {chatHistories.map(history => (
              <div
                key={history.id}
                onClick={() => loadChatHistory(history)}
                className="group p-3 border-b border-[#2d2d2d] hover:bg-[#007acc] cursor-pointer transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-white">{history.name}</p>
                    <p className="text-xs text-gray-400 group-hover:text-gray-200">
                      {history.messages.length} messages • {formatTime(history.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChatHistory(history.id, e)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/30 rounded transition-all duration-200"
                  >
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate group-hover:text-gray-300">
                  {history.messages[history.messages.length - 1]?.content.substring(0, 60)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-[#007acc] to-[#4ec9b0] rounded-full flex items-center justify-center">
              <Bot size={36} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4ec9b0] to-[#dcdcaa] rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-[#1e1e1e]" />
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Welcome to LUMINA AI</h3>
          <p className="text-sm text-gray-400 text-center mb-8 max-w-md">
            Your intelligent coding assistant powered by Gemini AI. I can help you with code explanations, refactoring, debugging, and more.
          </p>
          
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            <button
              onClick={() => setInput('Explain this React component:')}
              className="p-3 bg-[#2d2d2d] hover:bg-[#007acc] rounded-lg text-sm text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-[#4ec9b0] rounded group-hover:bg-white">
                  <Code size={12} className="text-[#1e1e1e]" />
                </div>
                <span className="font-medium text-white">Explain Code</span>
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-200">Get detailed explanations</p>
            </button>
            
            <button
              onClick={() => setInput('Refactor this function for better performance:')}
              className="p-3 bg-[#2d2d2d] hover:bg-[#007acc] rounded-lg text-sm text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-[#dcdcaa] rounded group-hover:bg-white">
                  <Wand2 size={12} className="text-[#1e1e1e]" />
                </div>
                <span className="font-medium text-white">Refactor</span>
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-200">Improve code quality</p>
            </button>
            
            <button
              onClick={() => setInput('Debug this issue:')}
              className="p-3 bg-[#2d2d2d] hover:bg-[#007acc] rounded-lg text-sm text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-[#ce9178] rounded group-hover:bg-white">
                  <Bug size={12} className="text-[#1e1e1e]" />
                </div>
                <span className="font-medium text-white">Debug</span>
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-200">Find and fix bugs</p>
            </button>
            
            <button
              onClick={() => setInput('Generate a React component that:')}
              className="p-3 bg-[#2d2d2d] hover:bg-[#007acc] rounded-lg text-sm text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-[#569cd6] rounded group-hover:bg-white">
                  <Plus size={12} className="text-[#1e1e1e]" />
                </div>
                <span className="font-medium text-white">Generate Code</span>
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-200">Create new components</p>
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 1 && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${
                m.role === 'user' 
                  ? 'bg-gradient-to-r from-[#007acc] to-[#0066b3]' 
                  : 'bg-gradient-to-r from-[#4ec9b0] to-[#3db8a0]'
              }`}>
                {m.role === 'user' ? 
                  <User size={16} className="text-white" /> : 
                  <Bot size={16} className="text-white" />
                }
              </div>
              
              <div className={`relative group max-w-[85%] ${
                m.role === 'user' ? 'text-right' : ''
              }`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-r from-[#007acc] to-[#0066b3] text-white rounded-tr-none' 
                    : 'bg-[#2d2d2d] text-gray-200 border border-[#333] rounded-tl-none'
                }`}>
                  <div 
                    dangerouslySetInnerHTML={{ __html: processMessageContent(m.content) }}
                    className="prose prose-invert max-w-none"
                  />
                  <div className={`text-xs mt-2 ${m.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {formatTime(m.timestamp)}
                  </div>
                </div>
                
                {m.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(m.content, m.id)}
                    className="absolute top-2 right-2 p-1.5 bg-[#1e1e1e] hover:bg-[#007acc] rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    {copiedMessageId === m.id ? (
                      <Check size={12} className="text-green-400" />
                    ) : (
                      <Copy size={12} className="text-gray-400 hover:text-white" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4ec9b0] to-[#3db8a0] flex items-center justify-center shadow-lg">
                <Bot size={16} className="text-white" />
              </div>
              <div className="p-4 bg-[#2d2d2d] rounded-2xl rounded-tl-none text-sm flex items-center gap-3 shadow-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-gray-400">LUMINA is thinking...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-[#1e1e1e] bg-[#2d2d2d]">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask LUMINA AI about code, debugging, or anything else..."
            className="w-full bg-[#3c3c3c] text-white text-sm rounded-xl p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#007acc] resize-none min-h-[60px] max-h-[200px] border border-[#444] placeholder-gray-500"
            rows={3}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={() => setInput('')}
              className={`p-1.5 text-gray-500 hover:text-white transition-all duration-200 ${!input.trim() ? 'opacity-0' : 'opacity-100'}`}
              disabled={!input.trim()}
            >
              <X size={16} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-2 rounded-full transition-all duration-300 ${
                !input.trim() || isTyping
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#007acc] to-[#4ec9b0] text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {isTyping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Press Enter to send</span>
            <span>Shift + Enter for new line</span>
            <span>Esc to clear</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>LUMINA AI Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatView;