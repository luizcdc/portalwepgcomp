"use client";
import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

function MapPlaceholder() {
  return <p>Instituto de Computação da UFBA - PAF 2</p>;
}

export default function Endereco() {
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
          placeholder={<MapPlaceholder />}
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
        </MapContainer>
      </div>
    </div>
  );
}
