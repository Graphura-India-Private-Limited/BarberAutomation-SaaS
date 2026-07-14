import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/theme.css'
import './index.css'
import { AuthProvider, QueueProvider } from "./contexts/AppContext";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Preserve support tickets database across logouts
const originalClear = window.localStorage.clear;
window.localStorage.clear = function() {
  const keysToKeep = ["app_tickets"];
  const saved = {};
  keysToKeep.forEach(k => {
    const val = window.localStorage.getItem(k);
    if (val !== null) saved[k] = val;
  });
  originalClear.apply(window.localStorage);
  Object.entries(saved).forEach(([k, val]) => {
    window.localStorage.setItem(k, val);
  });
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueueProvider>
        <App />
      </QueueProvider>
    </AuthProvider>
  </React.StrictMode>,
)
