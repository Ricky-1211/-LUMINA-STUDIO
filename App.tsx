import React from 'react';
import { Route, Switch } from 'wouter';
import VisualizationPage from './pages/VisualizationPage';
import EditorPage from './pages/EditorPage';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="bg-[#1a1a1a] text-[#f5f5f5] min-h-screen">
        <Switch>
          <Route path="/" component={VisualizationPage} />
          <Route path="/editor" component={EditorPage} />
        </Switch>
      </div>
    </ErrorBoundary>
  );
};

export default App;
