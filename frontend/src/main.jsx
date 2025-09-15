import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './i18n'
// Добавляем BrowserRouter вместо HashRouter для чистых URL
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<App/>
</BrowserRouter>
</React.StrictMode>
)
