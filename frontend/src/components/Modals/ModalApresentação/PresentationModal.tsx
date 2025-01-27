"use client";

import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import Star from "@/components/UI/Star";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { usePresentation } from "@/hooks/usePresentation";
import { useEdicao } from "@/hooks/useEdicao";

import "./style.scss";

export default function PresentationModal({ props }: { props: any }) {
  const presentationBookmarkData = { presentationId: props.id };
  const {
    getPresentationBookmark,
    postPresentationBookmark,
    deletePresentationBookmark,
  } = usePresentation();
  const [presentationBookmark, setpresentationBookmark] =
    useState<PresentationBookmark>();

  const { signed } = useContext(AuthContext);
  const router = useRouter();
  const { Edicao } = useEdicao();

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
    } else {
      postPresentationBookmark(presentationBookmarkData);
    }
    setpresentationBookmark({
      bookmarked: !(presentationBookmark && presentationBookmark.bookmarked),
    });
  }

  const handleEvaluateClick = () => {
    window.location.href = `/avaliacao/${props.id}`;
  };

  const presentationDate = moment(props.startTime).format("DD/MM");
  const presentationTime = moment(props.startTime).format("HH:mm");
  return (
    <div className="d-flex align-items-start flex-column text-black before-title">
      <div className="d-flex align-items-center w-100 title-div">
        <h3 className="fw-semibold text-start title-text">
          {props?.submission?.title}
        </h3>
      </div>
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex flex-column align-items-start fw-normal text-start first-subtitle">
          <div className="d-flex flex-row align-items-start second-subtitle">
            <h5>
              <strong>
                {props?.submission?.mainAuthor?.name ?? props?.mainAuthor?.name}
              </strong>{" "}
              | {props?.submission?.mainAuthor?.email}
            </h5>
          </div>
          <h5 className="fw-normal text-start">
            Orientador(a): {props.submission?.advisor?.name}
          </h5>
        </div>
        {!!signed && !!Edicao?.isActive && (
          <div>
            <button className="avaliar-button" onClick={handleEvaluateClick}>
              Avaliar
            </button>
          </div>
        )}
      </div>
      <div className="d-flex calendar-div">
        <h5 className="m-0 text-white calendar-text">
          {presentationDate} - {presentationTime}
        </h5>
        {!!signed && !!Edicao?.isActive && (
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
            className="fw-semibold bg-white link-text border border-0"
            href={`https://wepgcomp.s3.us-east-1.amazonaws.com/${props?.submission?.pdfFile}`}
            download
            target="_blank"
          >
            Baixar apresentação
          </a>
        </div>
      </div>
      <h5 className="abstract-text">
        <strong>Abstract: </strong>
        {props.submission?.abstract}
      </h5>
    </div>
  );
}
