"use client";
import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default function Endereco() {
  const customIcon = new L.Icon({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: "20px",
        color: "white",
      }}
    >
      <div className='fs-1 fw-bold'>Local do Evento</div>

      <div className='fs-6'>
        <div className='fw-bold'>Instituto de Computação da UFBA - PAF 2</div>

        <div>Avenida Milton Santos, s/n - Campus de Ondina</div>

        <div>CEP 40.170-110, Salvador - Bahia.</div>
      </div>

      <div className='fs-6'>E-mail: ceapg-ic@ufba.br</div>

      <div>
        <MapContainer
          center={[-13.0, -38.507]}
          zoom={30}
          style={{
            height: "180px",
            width: "150%",
            borderRadius: "8px",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Marker position={[-13.0, -38.507]} icon={customIcon}>
            <Popup>Instituto de Computação da UFBA - PAF 2</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
