"use client";
import Image from "next/image";
import Close from "@/assets/images/close.svg";

import { useState } from "react";

export default function Modal({
  content,
  reference,
}: {
  content: React.ReactNode;
  reference: React.RefObject<HTMLButtonElement>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <button
        ref={reference}
        onClick={() => openModal()}
        style={{ display: "none" }}
      ></button>
      {isOpen ? (
        <>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "fixed",
              backgroundColor: "#808080ba",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: "0",
              top: "0",
            }}
            onClick={() => closeModal()}
          ></div>
          <div
            style={{
              width: "60vw",
              maxWidth: "800px",
              backgroundColor: "white",
              borderRadius: "10px",
              border: "3px solid #F17F0C",
              position: "fixed",
              zIndex: "100",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              onClick={() => closeModal()}
              style={{
                position: "relative",
                left: "94%",
                top: "20px",
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
            >
              <Image
                src={Close}
                alt='ícone de fechar'
                width={24}
                height={24}
                priority={true}
              />
            </div>
            {content}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
