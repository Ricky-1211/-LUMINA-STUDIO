import React from 'react';
import { useLocation } from 'wouter';
import DogVisualization from '../Dog/DogVisualization';

const VisualizationPage: React.FC = () => {
    const [, setLocation] = useLocation();

    const handleEnterEditor = () => {
        setLocation('/editor');
    };

    return (
        <section className="relative min-h-screen">
            <DogVisualization onEnterEditor={handleEnterEditor} />
        </section>
    );
};

export default VisualizationPage;
