import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CargoList from './pages/CargoList';
import TransportList from './pages/TransportList';
import PlaceCargo from './pages/PlaceCargo';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
export default function App(){
  return (<BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/cargos' element={<CargoList/>} />
      <Route path='/transports' element={<TransportList/>} />
      <Route path='/place' element={<PlaceCargo/>} />
      <Route path='/chat' element={<Chat/>} />
      <Route path='/admin' element={<AdminPanel/>} />
    </Routes>
  </BrowserRouter>);
}
