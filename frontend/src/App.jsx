import React, {useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Services from './pages/Services'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App(){
  const [dark,setDark] = useState(false)
  return (
    <div className={dark ? 'theme-dark' : 'theme-light'}>
      <BrowserRouter>
        <Header dark={dark} setDark={setDark} />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/services' element={<Services/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/admin' element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
