"use client";

import { useState } from "react";

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
        style={{ border: "1px solid #F17F0C", width: "100%" }}
        className="card"
        onMouseOver={() => setOver(true)}
        onMouseOut={() => setOver(false)}
      >
        <div className="card-body d-flex flex-column align-items-center">
          <h6
            style={{
              fontSize: "13px",
              fontWeight: "600",
              lineHeight: "19.5px",
              margin: "0",
            }}
          >
            <strong>{title}</strong>
          </h6>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "400",
              lineHeight: "28px",
              margin: "0",
            }}
          >
            {author}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="card"
      style={{
        border: type != "PresentationSession" ? "1px solid #F17F0C" : undefined,
        width: "100%",
        cursor: type == "GeneralSession" ? "default" : "pointer",
        backgroundColor:
          over && type != "GeneralSession" ? "#F17F0C" : cardColor,
      }}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
      onClick={onClickEvent}
    >
      <div className="card-body d-flex flex-row align-items-center gap-2">
        <div>
          {author ? (
            <h6
              style={{
                fontSize: "20px",
                fontWeight: "600",
                lineHeight: "19.5px",
                margin: "0",
              }}
            >
              <strong>{author}</strong>
            </h6>
          ) : (
            ""
          )}
          <p
            style={{
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "28px",
              margin: "0",
            }}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
