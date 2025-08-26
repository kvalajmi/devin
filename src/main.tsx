import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// تعطيل StrictMode مؤقتاً لتجنب تنبيهات GoTrueClient في وضع التطوير
// يمكن تفعيله مرة أخرى في الإنتاج
const isDevelopment = true // مؤقتاً لتجنب تنبيهات GoTrueClient

ReactDOM.createRoot(document.getElementById('root')!).render(
  isDevelopment ? (
    <App />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
)
