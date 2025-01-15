"use client";

import { useState } from "react";

import "./style.scss";

export default function ScheduleCard({
  type,
  title,
  author,
  cardColor,
  onClickEvent,
}: Readonly<{
  type?: string;
  title: string;
  author: string;
  cardColor?: string;
  onClickEvent: React.MouseEventHandler<HTMLDivElement>;
}>) {
  const [over, setOver] = useState<boolean>(false);

  if (type == "outro") {
    return (
      <div
        className="card w-100 first-div"
        onMouseOver={() => setOver(true)}
        onMouseOut={() => setOver(false)}
      >
        <div className="card-body d-flex flex-column align-items-center">
          <h6 className="fw-semibold m-0 first-title">
            <strong>{title}</strong>
          </h6>
          <h6 className="fw-normal m-0 first-author">
            {author}
          </h6>
        </div>
      </div>
    );
  }
  return (
    <div
      className="card w-100"
      style={{
        border: type != "PresentationSession" ? "0.063rem solid #F17F0C" : undefined,
        cursor: type == "GeneralSession" ? "default" : "pointer",
        backgroundColor:
          over && type != "GeneralSession"
            ? "#F17F0C"
            : cardColor
              ? cardColor
              : "white",
      }}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
      onClick={onClickEvent}
    >
      <div className="card-body d-flex flex-row align-items-center gap-2">
        <div>
          {author ? (
            <h6 className="fw-semibold m-0 second-author">
              <strong>{author}</strong>
            </h6>
          ) : (
            ""
          )}
          <h6 className="fw-normal m-0 second-title">
            {title}
          </h6>
        </div>
      </div>
    </div>
  );
}
