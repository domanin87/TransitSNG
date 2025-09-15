import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './i18n'
// Убедимся, что используем HashRouter для совместимости
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
<React.StrictMode>
<HashRouter>
<App />
</HashRouter>
</React.StrictMode>
)