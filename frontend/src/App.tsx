import React from 'react';
import { Terminal } from './components/Terminal';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Terminal />
    </div>
  );
};

export default App; 
import React from 'react';
import Game from './components/Game';
import './App.css';

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
