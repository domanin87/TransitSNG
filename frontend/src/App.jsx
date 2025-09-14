import React, {useState, useEffect} from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Services from './pages/Services'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App(){
  const [dark,setDark] = useState(false)

  // apply theme class to root html element so CSS variables affect body/background too
  useEffect(()=>{
    const root = document.documentElement;
    if(dark) root.classList.add('theme-dark'); else root.classList.remove('theme-dark');
  }, [dark])

  return (
    <div>
      <Router>
        <Header dark={dark} setDark={setDark} />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/services' element={<Services/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/admin' element={<Admin/>} />
        </Routes>
      </Router>
    </div>
  )
}
