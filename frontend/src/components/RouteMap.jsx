import React, {useEffect, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({ from, to, routeCoords }){
  // from/to: { lat, lon } ; routeCoords: array of [lat, lon]
  const center = (from && [from.lat, from.lon]) || (to && [to.lat, to.lon]) || [43.238949,76.889709];
  return (<div style={{height:360, width:'100%', borderRadius:12, overflow:'hidden'}} className='card'>
    <MapContainer center={center} zoom={6} style={{height:'100%', width:'100%'}}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; OSM' />
      {from && <Marker position={[from.lat, from.lon]} />}
      {to && <Marker position={[to.lat, to.lon]} />}
      {routeCoords && routeCoords.length>0 && <Polyline positions={routeCoords.map(c=>[c.lat,c.lon])} />}
    </MapContainer>
  </div>);
}
