"use client";

import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";

import Star from "@/components/UI/Star";
import moment from "moment";
import { useRouter } from "next/navigation";
import { usePresentation } from "@/hooks/usePresentation";

interface PresentationCardProps {
  id: string;
  title: string;
  subtitle: string;
  name: string;
  pdfFile: string;
  email: string;
  advisorName: string;
  presentationData?: string;
  onDelete?: () => void;
}

export default function PresentationCard({
  id,
  title,
  subtitle,
  name,
  pdfFile,
  email,
  advisorName,
  presentationData,
  onDelete,
}: Readonly<PresentationCardProps>) {
  const presentationBookmarkData = { presentationId: id };
  const {
    getPresentationBookmark,
    postPresentationBookmark,
    deletePresentationBookmark,
  } = usePresentation();
  const [presentationBookmark, setpresentationBookmark] =
    useState<PresentationBookmark>();

  const { signed } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (signed) {
      getPresentationBookmark(presentationBookmarkData).then(
        setpresentationBookmark
      );
    }
  }, []);
  
  function handleFavorite() {
    if (!signed) {
      router.push("/login");
      return;
    }
    if (presentationBookmark && presentationBookmark.bookmarked) {
      deletePresentationBookmark(presentationBookmarkData);
      if(onDelete) {
        onDelete();
      }
    } else {
      postPresentationBookmark(presentationBookmarkData);
    }
    setpresentationBookmark({
      bookmarked: !(presentationBookmark && presentationBookmark.bookmarked),
    });
  }
  
  const handleEvaluateClick = () => {
    window.location.href = `/avaliacao/${id}`;
  };
  
  const presentationDate = moment(presentationData).format("DD/MM");
  const presentationTime = moment(presentationData).format("HH:MM");
  return (
    <div
      className="d-flex align-items-start flex-column text-black"
      style={{ padding: "25px", gap: "10px", border: '3px solid #f17f0c', borderRadius: '10px'}}
    >
      <div
        className="d-flex align-items-center w-100"
        style={{
          gap: "15px",
          borderBottom: "1px solid #000000",
          paddingBottom: "15px",
        }}
      >
        <h3
          className="fw-semibold text-start"
          style={{ fontSize: "18px", lineHeight: "27px" }}
        >
          {title}
        </h3>
      </div>
      <div className="d-flex justify-content-between w-100">
        <div
          className="d-flex flex-column align-items-start fw-normal text-start"
          style={{ fontSize: "15px", gap: "6px" }}
        >
          <div
            className="d-flex flex-row align-items-start"
            style={{ gap: "10px" }}
          >
            <strong>{name}</strong>
            <div> | </div>
            <div>{email}</div>
          </div>
          <h4 className="fw-normal text-start" style={{ fontSize: "15px" }}>
            Orientador(a): {advisorName}
          </h4>
        </div>
        {!!signed && (
          <div>
            <button className="avaliar-button" onClick={handleEvaluateClick}>
              Avaliar
            </button>
          </div>
        )}
      </div>
      <div className="d-flex" style={{ gap: "10px" }}>
        <em
          className="m-0 text-white"
          style={{
            backgroundColor: "#F17F0C",
            borderRadius: "5px",
            padding: "4px 10px",
            fontSize: "15px",
          }}
        >
          {presentationDate} - SALA A - {presentationTime}
        </em>
        {!!signed && (
          <div onClick={handleFavorite} style={{ cursor: "pointer" }}>
            {presentationBookmark && (
              <Star
                color={presentationBookmark.bookmarked ? "#F17F0C" : "#D9D9D9"}
              />
            )}
          </div>
        )}
        <div className="d-flex align-items-center">
          <a
            className="fw-semibold bg-white"
            style={{
              border: "none",
              borderRadius: "20px",
              color: "#FFA90F",
              padding: "3px 20px",
            }}
            href={`https://wepgcomp.s3.us-east-1.amazonaws.com/${pdfFile}`}
            download
            target="_blank"
          >
            Baixar apresentação
          </a>
        </div>
      </div>
      <div style={{ textAlign: "justify" }}>
        <strong>Abstract: </strong>
        {subtitle}
      </div>
    </div>
  );
}
