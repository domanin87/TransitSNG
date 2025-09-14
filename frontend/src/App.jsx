
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CargoList from './pages/CargoList.jsx'
import Chat from './pages/Chat.jsx'
import Tariffs from './pages/Tariffs.jsx'
import LiveMap from './pages/LiveMap.jsx'
import Admin from './pages/Admin.jsx'
import Header from './components/Header.jsx'
export default function App(){
  return (
    <BrowserRouter>
      <Header/>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/cargo" element={<CargoList/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/tariffs" element={<Tariffs/>} />
          <Route path="/map" element={<LiveMap/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
