"use client";

import CardListagem from "@/components/CardListagem/CardListagem";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

import "./style.scss";
import Banner from "@/components/UI/Banner";

interface ListagemProps {
  title: string;
  labelAddButton: string;
  searchPlaceholder: string;
  cardsList: any[];
  labelListCardsButton?: string;
  isMyPresentation?: boolean;
  idModal?: string;
  onAddButtonClick?: () => void;
}

export default function Listagem({
  idModal,
  title,
  labelAddButton,
  labelListCardsButton,
  searchPlaceholder,
  isMyPresentation,
  cardsList,
  onAddButtonClick,
}: Readonly<ListagemProps>) {
  return (
    <div className="listagem-template">
      <Banner title={title} />
      <div className="listagem-template-content">
        <div className="listagem-template-user-area">
          <button
            type="button"
            data-bs-toggle={idModal ? "modal" : undefined}
            data-bs-target={idModal ? `#${idModal}` : undefined}
            onClick={idModal ? () => {} : onAddButtonClick}
          >
            {labelAddButton}{" "}
            <Image src="/assets/images/add.svg" alt="" width={24} height={24} />
          </button>
          <div
            className="input-group listagem-template-content-input"
            style={{ visibility: isMyPresentation ? "hidden" : "visible" }}
          >
            <input
              placeholder={searchPlaceholder}
              type="text"
              className="form-control"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              <Image
                src="/assets/images/search.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
        <div className="listagem-template-cards">
          {cardsList?.map((card) => (
            <CardListagem
              key={card.name}
              title={card.name}
              subtitle={
                title === "Sessões"
                  ? `${formatDate(card.startAt)}`
                  : card.subtitle
              }
              onClick={() => {}}
            />
          ))}
        </div>
        <button
          className="listagem-template-mais-cards"
          style={{ visibility: isMyPresentation ? "hidden" : "visible" }}
        >
          {labelListCardsButton}

          <Image
            className="listagem-template-mais-cards-icon"
            src="/assets/images/seta.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
