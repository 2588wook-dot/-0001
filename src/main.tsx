import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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
    console.log("ArchiLog: Root render called.");
  } catch (err) {
    console.error("ArchiLog: Initialization Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #ef4444; font-family: sans-serif; text-align: center;">
        <h1 style="font-weight: 900; margin-bottom: 1rem;">BOOT ERROR</h1>
        <p style="color: #4b5563; font-weight: 600;">시스템을 시작하는 중 오류가 발생했습니다.</p>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; display: inline-block; text-align: left; margin-top: 1rem; font-size: 0.75rem;">${err instanceof Error ? err.stack || err.message : String(err)}</pre>
        <br/>
        <button onclick="window.location.reload()" style="margin-top: 2rem; background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; cursor: pointer;">새로고침</button>
      </div>
    `;
  }
} else {
  console.error("ArchiLog: Root element #root not found.");
}
