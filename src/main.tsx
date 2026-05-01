import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("ArchiLog: Application Mounting...");

// Global error handler for early catching
window.onerror = (message, source, lineno, colno, error) => {
  console.error("ArchiLog: Global Error:", { message, source, lineno, colno, error });
  const root = document.getElementById('root');
  if (root && root.innerHTML.includes('Loading Application')) {
    root.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
      <h2>Critical Load Error</h2>
      <p>${message}</p>
    </div>`;
  }
};

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    console.log("ArchiLog: Initializing React root...");
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log("ArchiLog: Render call completed.");
  } catch (err) {
    console.error("ArchiLog: Mount Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h1 style="font-weight: 900;">MOUNT ERROR</h1>
        <p>${err instanceof Error ? err.message : String(err)}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
      </div>
    `;
  }
} else {
  console.error("ArchiLog: Root element #root not found.");
}
