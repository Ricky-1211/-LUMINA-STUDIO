// components/ActivityBar.tsx
import React, { useState } from 'react';
import { 
  Files, Search, GitBranch, Play, Blocks, Settings, 
  User, MessageSquareCode, Zap, Bug, ChevronLeft, ChevronRight,
  Folder, MessageSquare, LogOut, Key, Moon, Sun, Bell,
  HelpCircle, Monitor, Globe, Shield, Database, Mail,
  CreditCard, Users, Briefcase, Palette
} from 'lucide-react';
import { SidebarView } from '../types';

interface ActivityBarProps {
  activeView: SidebarView;
  setActiveView: (view: SidebarView) => void;
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  onToolClick?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'developer';
  plan: 'free' | 'pro' | 'enterprise';
}

const ActivityBar: React.FC<ActivityBarProps> = ({ 
  activeView, 
  setActiveView, 
  sidebarVisible, 
  toggleSidebar,
  onToolClick 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState('#007acc');

  // Mock user profile data
  const userProfile: UserProfile = {
    name: 'John Developer',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'developer',
    plan: 'pro'
  };

  const topItems = [
    { icon: Files, view: 'explorer', label: 'Explorer' },
    { icon: Search, view: 'search', label: 'Search' },
    { icon: GitBranch, view: 'git', label: 'Source Control' },
    { icon: Play, view: 'debug', label: 'Run and Debug' },
    { icon: Blocks, view: 'extensions', label: 'Extensions' },
    { icon: MessageSquareCode, view: 'ai_chat', label: 'AI Chat' },
    { icon: Zap, view: 'tools', label: 'Tools', hasCustomHandler: true },
  ];

  // Settings categories
  const settingsCategories = [
    {
      icon: User,
      title: 'Account',
      items: [
        { icon: Mail, label: 'Email Settings', description: 'Manage email notifications' },
        { icon: Shield, label: 'Security', description: 'Password & 2FA settings' },
        { icon: CreditCard, label: 'Billing', description: 'Payment methods & invoices' },
        { icon: Globe, label: 'Language & Region', description: 'Interface language' }
      ]
    },
    {
      icon: Monitor,
      title: 'Appearance',
      items: [
        { icon: Palette, label: 'Theme', description: 'Choose color theme' },
        { icon: Sun, label: 'Light Mode', description: 'Switch to light theme' },
        { icon: Moon, label: 'Dark Mode', description: 'Switch to dark theme' },
        { icon: Database, label: 'Editor Settings', description: 'Customize editor' }
      ]
    },
    {
      icon: Settings,
      title: 'General',
      items: [
        { icon: Bell, label: 'Notifications', description: 'Configure notifications' },
        { icon: Key, label: 'Keyboard Shortcuts', description: 'Customize shortcuts' },
        { icon: Briefcase, label: 'Workspace', description: 'Workspace settings' },
        { icon: Users, label: 'Collaboration', description: 'Team collaboration settings' }
      ]
    }
  ];

  // Profile actions
  const profileActions = [
    { icon: User, label: 'View Profile', action: () => console.log('View Profile') },
    { icon: Settings, label: 'Account Settings', action: () => setShowSettings(true) },
    { icon: CreditCard, label: 'Billing & Plans', action: () => console.log('Billing') },
    { icon: Shield, label: 'Security', action: () => console.log('Security') },
    { icon: LogOut, label: 'Sign Out', action: () => console.log('Sign Out'), destructive: true }
  ];

  const handleIconClick = (view: SidebarView, hasCustomHandler?: boolean) => {
    if (hasCustomHandler && onToolClick) {
      onToolClick();
      return;
    }
    
    if (activeView === view && sidebarVisible) {
      toggleSidebar();
    } else {
      setActiveView(view);
      if (!sidebarVisible) toggleSidebar();
    }
    
    // Close panels when clicking other icons
    setShowSettings(false);
    setShowUserProfile(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderSettingsPanel = () => (
    <div className="fixed left-12 top-0 h-screen w-80 bg-[#1e1e1e] shadow-2xl border-r border-[#333] z-[60] overflow-y-auto animate-slideIn">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button 
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#333] text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {settingsCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <category.icon size={18} />
                <span className="text-sm font-medium">{category.title}</span>
              </div>
              
              <div className="space-y-1 ml-6">
                {category.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.label.includes('Dark Mode')) {
                        setDarkMode(true);
                        document.documentElement.classList.add('dark');
                      }
                      if (item.label.includes('Light Mode')) {
                        setDarkMode(false);
                        document.documentElement.classList.remove('dark');
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded hover:bg-[#252525] text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={16} className="text-[#007acc]" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    {item.label.includes('Mode') && (
                      <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${
                        (darkMode && item.label.includes('Dark')) || 
                        (!darkMode && item.label.includes('Light')) 
                          ? 'bg-[#007acc] justify-end' 
                          : 'bg-[#333] justify-start'
                      }`}>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-[#333]">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Theme Color</h3>
            <div className="flex space-x-2">
              {['#007acc', '#4CAF50', '#9C27B0', '#FF5722', '#2196F3'].map((color) => (
                <button
                  key={color}
                  onClick={() => setThemeColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    themeColor === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Set theme to ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#333] space-y-3">
            <button className="w-full p-3 bg-[#007acc] text-white rounded font-medium hover:bg-[#0062a3] transition-colors">
              Save Settings
            </button>
            <button className="w-full p-3 border border-[#333] text-gray-400 rounded font-medium hover:bg-[#252525] hover:text-white transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserProfilePanel = () => (
    <div className="fixed left-12 top-0 h-screen w-80 bg-[#1e1e1e] shadow-2xl border-r border-[#333] z-[60] overflow-y-auto animate-slideIn">
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-[#333]">
          <img 
            src={userProfile.avatar} 
            alt={userProfile.name}
            className="w-12 h-12 rounded-full border-2 border-[#007acc]"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-white">{userProfile.name}</h3>
            <p className="text-sm text-gray-400">{userProfile.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-0.5 text-xs rounded ${
                userProfile.plan === 'pro' 
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50'
                  : 'bg-blue-900/30 text-blue-300 border border-blue-700/50'
              }`}>
                {userProfile.plan.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded border border-gray-700">
                {userProfile.role}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowUserProfile(false)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#333] text-xl"
          >
            ×
          </button>
        </div>

        {/* Profile Actions */}
        <div className="space-y-1 mb-6">
          {profileActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.action();
                setShowUserProfile(false);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded text-left hover:bg-[#252525] transition-colors ${
                action.destructive ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              <action.icon size={18} />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Usage Stats */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Usage</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Storage</span>
                <span className="text-sm text-white">4.2/10 GB</span>
              </div>
              <div className="w-full bg-[#333] rounded-full h-2">
                <div 
                  className="bg-[#007acc] h-2 rounded-full" 
                  style={{ width: '42%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">API Usage</span>
                <span className="text-sm text-white">85/100 calls</span>
              </div>
              <div className="w-full bg-[#333] rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-[#333] pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center p-3 bg-[#252525] rounded text-sm text-gray-300 hover:text-white hover:bg-[#333] transition-colors">
              <HelpCircle size={16} className="mr-2" />
              Help
            </button>
            <button className="flex items-center justify-center p-3 bg-[#252525] rounded text-sm text-gray-300 hover:text-white hover:bg-[#333] transition-colors">
              <MessageSquare size={16} className="mr-2" />
              Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-14 bg-gradient-to-b from-[#0f111a] to-[#1a1d2e] flex flex-col items-center py-3 border-r border-[#2a2f45] z-50 relative">
        {/* Toggle button */}
        <button 
          onClick={toggleSidebar}
          className="group p-2 mb-4 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#4ec9b0] rounded-lg transition-all duration-300"
          title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        >
          {sidebarVisible ? (
            <ChevronLeft size={20} className="group-hover:text-white" />
          ) : (
            <ChevronRight size={20} className="group-hover:text-white" />
          )}
        </button>
        
        {/* Main icons section */}
        <div className="flex-1 space-y-1 w-full flex flex-col items-center">
          {topItems.map(({ icon: Icon, view, label, hasCustomHandler }) => (
            <button
              key={view}
              title={label}
              onClick={() => handleIconClick(view as SidebarView, hasCustomHandler)}
              className={`group w-full py-3 flex items-center justify-center relative transition-all duration-300 ${
                activeView === view && sidebarVisible
                  ? 'text-white border-l-2 border-l-[#7c3aed] bg-[#252a3d]'
                  : 'text-[#6b7280] hover:text-white hover:bg-gradient-to-r hover:from-[#7c3aed]/20 hover:to-[#4ec9b0]/20'
              }`}
            >
              <Icon size={20} strokeWidth={1.5} className="group-hover:text-white" />
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#1a1d2e] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none shadow-xl border border-[#2a2f45]">
                {label}
              </div>
            </button>
          ))}
        </div>
        
        {/* Bottom section with user and settings */}
        <div className="space-y-2 mt-auto relative">
          {/* User Profile Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowUserProfile(!showUserProfile);
                setShowSettings(false);
              }}
              className={`group p-2.5 rounded-lg transition-all duration-300 relative ${
                showUserProfile
                  ? 'text-white bg-gradient-to-r from-[#7c3aed] to-[#4ec9b0]'
                  : 'text-[#6b7280] hover:text-white hover:bg-gradient-to-r hover:from-[#7c3aed]/30 hover:to-[#4ec9b0]/30'
              }`}
              title="User Profile"
            >
              <User size={20} strokeWidth={1.5} className="group-hover:text-white" />
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#1a1d2e] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none shadow-xl border border-[#2a2f45]">
                Profile
              </div>
            </button>
          </div>

          {/* Settings Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                setShowUserProfile(false);
              }}
              className={`group p-2.5 rounded-lg transition-all duration-300 relative ${
                showSettings
                  ? 'text-white bg-gradient-to-r from-[#7c3aed] to-[#4ec9b0]'
                  : 'text-[#6b7280] hover:text-white hover:bg-gradient-to-r hover:from-[#7c3aed]/30 hover:to-[#4ec9b0]/30'
              }`}
              title="Settings"
            >
              <Settings size={20} strokeWidth={1.5} className="group-hover:text-white" />
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#1a1d2e] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none shadow-xl border border-[#2a2f45]">
                Settings
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Render panels above the activity bar */}
      {showSettings && renderSettingsPanel()}
      {showUserProfile && renderUserProfilePanel()}
      
      {/* Overlay for closing panels when clicking outside */}
      {(showSettings || showUserProfile) && (
        <div 
          className="fixed inset-0 z-[55] bg-transparent"
          onClick={() => {
            setShowSettings(false);
            setShowUserProfile(false);
          }}
        />
      )}
    </>
  );
};

// Add this CSS animation to your global CSS file or style tag
const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.2s ease-out;
}
`;

export default ActivityBar;