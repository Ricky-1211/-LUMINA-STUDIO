import React from 'react';
import { Route, Switch } from 'wouter';
import VisualizationPage from './pages/VisualizationPage';
import EditorPage from './pages/EditorPage';

const App: React.FC = () => {
  return (
    <div className="bg-[#0b0d12] text-white min-h-screen">
      <Switch>
        <Route path="/" component={VisualizationPage} />
        <Route path="/editor" component={EditorPage} />
      </Switch>
    </div>
  );
};

export default App;
