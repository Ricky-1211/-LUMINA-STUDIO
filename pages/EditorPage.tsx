import React from 'react';
import CodeEditorLayout from '../components/CodeEditorLayout';
import { useUIStore } from '../store';

const EditorPage: React.FC = () => {
    const { sidebarVisible, toggleSidebar } = useUIStore();
    
    return (
        <section className="relative min-h-screen bg-[#1a1a1a] border-t border-[#333333] shadow-inner">
            <CodeEditorLayout />
        </section>
    );
};

export default EditorPage;
