import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/theme.css'
import './index.css'
import { AuthProvider, QueueProvider } from "./contexts/AppContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueueProvider>
        <App />
      </QueueProvider>
    </AuthProvider>
  </React.StrictMode>,
)
