"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useEdicao } from "@/hooks/useEdicao";

import "./style.scss";

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

  const { updateEdicao, Edicao } = useEdicao();

  const handleEditAdress = () => {
    updateEdicao(Edicao?.id ?? "", { location: content });
  };

  const latitude = -13.0;
  const longitude = -38.507;

  useEffect(() => {
    setContent(Edicao?.location ?? "");
  }, [Edicao?.location]);

  return (
    <div className="container endereco-home">
      <div className="fs-1 fw-bold">Local do Evento</div>

      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
        handleEditField={handleEditAdress}
      />

      <div>
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          placeholder={<MapPlaceholder />}
          className="map-home"
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
