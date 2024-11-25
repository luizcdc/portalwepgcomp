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
  searchValue?: string;
  labelListCardsButton?: string;
  isMyPresentation?: boolean;
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
  isMyPresentation,
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
            {labelAddButton}
            <Image src="/assets/images/add.svg" alt="" width={24} height={24} />
          </button>
          {onChangeSearchValue && (
            <div
              className="input-group listagem-template-content-input"
              style={{ visibility: isMyPresentation ? "hidden" : "visible" }}
            >
              <input
                placeholder={searchPlaceholder}
                type="text"
                className="form-control"
                aria-label="campo de busca"
                aria-describedby="botao-busca"
                value={searchValue}
                onChange={(e) => onChangeSearchValue(e.target.value)}
              />

              <button
                className="btn btn-outline-secondary"
                type="button"
                id="botao-busca"
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
          {!!cardsList.length &&
            cardsList?.map((card) => (
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
          {!cardsList.length && (
            <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
              <h4 className="empty-list mb-0">
                <Image
                  src="/assets/images/empty_box.svg"
                  alt="Lista vazia"
                  width={90}
                  height={90}
                />
                Essa lista ainda está vazia
              </h4>
            </div>
          )}
        </div>
        <button
          className="listagem-template-mais-cards"
          style={{
            visibility:
              isMyPresentation || cardsList.length <= 4 ? "hidden" : "visible",
          }}
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
