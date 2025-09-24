// src/components/RouteMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправляем проблему с иконками Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RouteMap = () => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[51.1694, 71.4491]} // координаты:  Астана
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.1694, 71.4491]}>
          <Popup>Это тестовая точка в Казахстане 🚚</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RouteMap;
