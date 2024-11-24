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
  labelListCardsButton: string;
  cardsList: any[];
  searchValue?: string;
  idModal?: string;
  onAddButtonClick?: () => void;
  onChangeSearchValue?: (value: string) => void;
}

export default function Listagem({
  idModal,
  title,
  labelAddButton,
  labelListCardsButton,
  searchPlaceholder,
  searchValue,
  cardsList,
  onAddButtonClick,
  onChangeSearchValue,
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
          {onChangeSearchValue && (
            <div className="input-group listagem-template-content-input">
              <input
                placeholder={searchPlaceholder}
                type="text"
                className="form-control"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                value={searchValue}
                onChange={(e) => onChangeSearchValue(e.target.value)}
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
          )}
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
        <button className="listagem-template-mais-cards">
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
