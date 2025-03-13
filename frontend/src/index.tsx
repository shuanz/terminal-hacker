import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { initWasm } from './utils/CommandProcessor';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const init = async () => {
  try {
    await initWasm();
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  } catch (error) {
    const errorMessage = document.createElement('div');
    errorMessage.style.color = 'red';
    errorMessage.style.padding = '20px';
    errorMessage.textContent = `Failed to initialize WebAssembly module: ${error instanceof Error ? error.message : 'Unknown error'}`;
    root.appendChild(errorMessage);
  }
};

init(); 