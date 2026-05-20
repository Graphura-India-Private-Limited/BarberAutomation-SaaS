import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/theme.css'
import './index.css'
import { ServiceProvider } from './context/ServiceContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { SubscriptionProvider } from './context/SubscriptionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SubscriptionProvider>
      <ServiceProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ServiceProvider>
    </SubscriptionProvider>
  </React.StrictMode>,
)