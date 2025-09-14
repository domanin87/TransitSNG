import React, {useEffect} from 'react'
import L from 'leaflet'
export default function MapPage(){
  useEffect(()=>{
    const map = L.map('map').setView([51.0, 71.5], 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map)
    // sample markers
    const markers = [[43.2220,76.8512,'Алматы'],[55.7558,37.6173,'Москва'],[41.2995,69.2401,'Ташкент']]
    markers.forEach(m=> L.marker([m[0],m[1]]).addTo(map).bindPopup(m[2]))
    return ()=> map.remove()
  },[])
  return (<div className="container"><h2>Карта</h2><div id="map" style={{height:500,borderRadius:12}}></div></div>)
}
