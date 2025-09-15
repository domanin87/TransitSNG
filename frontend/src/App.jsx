import React, {useState, useEffect} from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Services from './pages/Services'
import Tariffs from './pages/Tariffs'
import MapPage from './pages/MapPage'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import PostCargo from './pages/PostCargo'

export default function App(){
const [dark, setDark] = useState(false)
const [user, setUser] = useState(null)

useEffect(() => {
document.documentElement.classList.toggle('theme-dark', dark)
// Проверяем авторизацию при загрузке приложения
const userData = localStorage.getItem('user')
if (userData) {
  setUser(JSON.parse(userData))
}
}, [dark])

return (
<Router>
<Header dark={dark} setDark={setDark} user={user} setUser={setUser} />
<Routes>
<Route path='/' element={<Home user={user} />} />
<Route path='/services' element={<Services user={user} />} />
<Route path='/tariffs' element={<Tariffs />} />
<Route path='/map' element={<MapPage />} />
<Route path='/chat' element={<ChatPage />} />
<Route path='/login' element={<Login setUser={setUser} />} />
<Route path='/register' element={<Register />} />
<Route path='/post' element={<PostCargo />} />
<Route path='/admin/*' element={<Admin />} />
</Routes>
</Router>
)
}