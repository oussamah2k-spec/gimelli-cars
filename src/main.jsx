import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppErrorBoundary from './components/AppErrorBoundary';
import './styles/globals.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element with id "root" was not found in public/index.html.');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);