
import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { io } from 'socket.io-client'
export default function LiveMap(){ 
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const [ready,setReady] = useState(false)
  useEffect(()=>{
    const API = window.APP_CONFIG?.API_URL || '/api/v1'
    const base = (API.replace('/api/v1',''))
    const socket = io(base, { transports:['websocket'] })
    socket.on('connect', ()=> console.log('socket connected', socket.id))
    socket.on('location_update', (data)=>{
      // data: { driver_id, cargo_id, lat, lon }
      const key = 'cargo_'+(data.cargoId||data.driverId||data.driver_id)
      if(!mapRef.current) return
      const lat = Number(data.lat); const lon = Number(data.lon)
      if(!lat||!lon) return
      if(!markersRef.current[key]){
        const m = L.marker([lat,lon]).addTo(mapRef.current)
        m.bindPopup(key)
        markersRef.current[key]=m
      } else {
        markersRef.current[key].setLatLng([lat,lon])
      }
    })
    // init map
    const el = document.getElementById('maplive')
    if(el && !mapRef.current){
      mapRef.current = L.map(el).setView([51.1605, 71.4704], 5)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(mapRef.current)
      setReady(true)
    }
    return ()=> socket.disconnect()
  },[])
  return (<div className="card"><h2>Live Map</h2><div id="maplive" style={{height:450,width:'100%'}}></div></div>)
}
