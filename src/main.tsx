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
      </StrictMode>,
    );
    console.log("ArchiLog: Render success.");
  } catch (err) {
    console.error("ArchiLog: Mount Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h1 style="font-weight: 900;">MOUNT ERROR</h1>
        <p>${err instanceof Error ? err.message : String(err)}</p>
      </div>
    `;
  }
} else {
  console.error("ArchiLog: Root element #root not found.");
}
