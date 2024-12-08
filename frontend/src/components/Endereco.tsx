"use client";
import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import HtmlEditorComponent from "./HtmlEditorComponent/HtmlEditorComponent";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { SessoesMock } from "@/mocks/Sessoes";
import { useEdicao } from "@/hooks/useEdicao";

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
  const { signed } = useContext(AuthContext);

  const { updateEdicao, Edicao } = useEdicao();
  const { eventEditionId } = SessoesMock;

  const handleEditAdress = () => {
    updateEdicao(eventEditionId, { location: content });
  };

  const latitude = -13.0;
  const longitude = -38.507;

  useEffect(() => {
    setContent(Edicao?.location ?? "");
  }, [Edicao?.location]);

  return (
    <div className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: "20px",
        color: "white",
        width: "100%",
      }}
    >
      <div className="fs-1 fw-bold">Local do Evento</div>

      {signed ? (
        <HtmlEditorComponent
          content={content}
          onChange={(newValue) => setContent(newValue)}
          handleEditField={handleEditAdress}
        />
      ) : (
        <div className="fs-6">
          <div className="fw-bold">Instituto de Computação da UFBA - PAF 2</div>
          <div>Avenida Milton Santos, s/n - Campus de Ondina</div>
          <div>CEP 40.170-110, Salvador - Bahia.</div>
        </div>
      )}

      <div>
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          placeholder={<MapPlaceholder />}
          style={{
            height: "180px",
            width: "100%",
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
