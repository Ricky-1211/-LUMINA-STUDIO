import React from 'react';
import CodeEditorLayout from '../components/CodeEditorLayout';

const EditorPage: React.FC = () => {
    return (
        <section className="relative min-h-screen bg-[#0f111a] border-t border-[#161a25] shadow-inner">
            <CodeEditorLayout />
        </section>
    );
};

export default EditorPage;
