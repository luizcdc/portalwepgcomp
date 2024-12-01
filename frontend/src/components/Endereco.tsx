"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import HtmlEditorComponent from "./HtmlEditorComponent/HtmlEditorComponent";

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
  const [content, setContent] = useState("");

  const latitude = -13.0;
  const longitude = -38.507;

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
      <div className="fs-1 fw-bold">Local do Evento</div>

      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
      />

      <div>
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          placeholder={<MapPlaceholder />}
          style={{
            height: "180px",
            width: "150%",
            borderRadius: "8px",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
}
