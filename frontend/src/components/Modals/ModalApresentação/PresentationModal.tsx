"use client";

import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import Star from "@/components/UI/Star";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { usePresentation } from "@/hooks/usePresentation";

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

  const presentationDate = moment(props.presentationTime).format("DD/MM");
  const presentationTime = moment(props.presentationTime).format("HH:MM");
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
            <h6>
              <strong>{props?.submission?.mainAuthor?.name ?? props?.mainAuthor?.name}</strong> | {props?.submission?.mainAuthor?.email}
            </h6>
          </div>
          <h6 className="fw-normal text-start">
            Orientador(a): {props.submission?.advisor?.name}
          </h6>
        </div>
        {!!signed && (
          <div>
            <button className="avaliar-button" onClick={handleEvaluateClick}>
              Avaliar
            </button>
          </div>
        )}
      </div>
      <div className="d-flex calendar-div">
        <h6 className="m-0 text-white calendar-text">
          {presentationDate} - SALA A - {presentationTime}
        </h6>
        {!!signed && (
          <div onClick={handleFavorite} className="pe-auto">
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
      <div className="abstract-text">
        <strong>Abstract: </strong>
        {props.submission?.abstract}
      </div>
    </div>
  );
}
