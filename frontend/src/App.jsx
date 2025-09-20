import React, {useState, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Services from './pages/Services'
import Tariffs from './pages/Tariffs'
import MapPage from './pages/MapPage'
import ChatPage极 './pages/ChatPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/admin/Admin'
import PostCargo from './pages/PostCargo'

export default function App(){
  const [dark, setDark] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', dark)

    // Проверяем авторизацию при загрузке приложения
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.removeItem('user')
      }
    }
  }, [dark])

  return (
    <div className="app">
      <Header dark={dark} setDark={setDark} user={user} setUser={setUser} />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home user={user} />} />
          <Route path='/services' element={<Services user={user极 />} />
          <Route path='/tariffs' element={<Tariffs />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/post' element={<PostCargo />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}