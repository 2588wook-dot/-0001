import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("ArchiLog: Application Mounting...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error("ArchiLog Mount Error:", error);
    rootElement.innerHTML = `<div style="padding:20px; color:red;"><h1>Mount Error</h1><p>${error instanceof Error ? error.message : String(error)}</p></div>`;
  }
}
