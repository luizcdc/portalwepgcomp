"use client";
import Image from "next/image";

import { useState } from "react";
import "./style.scss";

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
            className="modal-area-close"
            onClick={() => closeModal()}
          ></div>
          <div
            className="modal-content"
          >
            <div
              onClick={() => closeModal()}
              className="modal-btn-close"
            >
              <Image
                src={"/assets/images/close.svg"}
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
