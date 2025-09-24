// src/components/RouteMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Исправляем проблему с иконками Leaflet - используем корректный импорт
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Создаем иконку только один раз при загрузке модуля
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RouteMap = () => {
  // Добавляем проверку на клиентский рендеринг
  if (typeof window === 'undefined') {
    return <div style={{ height: "500px", width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading map...
    </div>;
  }

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={[51.1694, 71.4491]} // координаты: Астана
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
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