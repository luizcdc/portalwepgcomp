"use client";

import Image from "next/image";

import CardListagem from "@/components/CardListagem/CardListagem";
import Banner from "@/components/UI/Banner";
import { formatDate } from "@/utils/formatDate";

import "./style.scss";

interface ListagemProps {
  title: string;
  labelAddButton?: string;
  searchPlaceholder: string;
  cardsList: any[];
  searchValue?: string;
  isMyPresentation?: boolean;
  isFavorites?: boolean;
  isLoading?: boolean;
  idModal?: string;
  idGeneralModal?: string;
  generalButtonLabel?: string;
  onAddButtonClick?: () => void;
  onChangeSearchValue?: (value: string) => void;
  onClickItem?: (value: string) => void;
  onDelete?: (id: string) => void;
  onClear?: () => void;
}

export default function Listagem({
  idModal,
  title,
  labelAddButton,
  searchPlaceholder,
  searchValue,
  isMyPresentation,
  isFavorites,
  cardsList,
  onAddButtonClick,
  onChangeSearchValue,
  generalButtonLabel,
  onClickItem,
  idGeneralModal,
  onDelete,
  onClear,
}: Readonly<ListagemProps>) {
  return (
    <div className="listagem-template">
      <Banner title={title} />
      <div className="listagem-template-content">
        <div className="listagem-template-user-area">
          {labelAddButton ? (
            <button
              type="button"
              data-bs-toggle={idModal ? "modal" : undefined}
              data-bs-target={idModal ? `#${idModal}` : undefined}
              onClick={idModal ? onClear : onAddButtonClick}
            >
              {labelAddButton}
              <Image
                src="/assets/images/add.svg"
                alt=""
                width={24}
                height={24}
              />
            </button>
          ) : (
            ""
          )}
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
            !isFavorites &&
            cardsList?.map((card) => (
              <CardListagem
                key={card.id}
                title={card.title ?? "Sem título"}
                subtitle={
                  title === "Sessões"
                    ? `${formatDate(card.startTime)}`
                    : card.subtitle
                }
                generalButtonLabel={generalButtonLabel}
                idGeneralModal={
                  card?.type == "Presentation" && !!card?.presentations.length
                    ? idGeneralModal
                    : ""
                }
                idModalEdit={idModal}
                onClickItem={() => onClickItem && onClickItem(card)}
                onDelete={() => onDelete && onDelete(card?.id ?? "")}
              />
            ))}
          {!!cardsList.length &&
            isFavorites &&
            cardsList?.map((card) => (
              <CardListagem
                key={card.name}
                title={card.name}
                subtitle={
                  title === "Sessões"
                    ? `${formatDate(card.startAt)}`
                    : card.subtitle
                }
                showFavorite
                onClickItem={() => onClickItem && onClickItem(card)}
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
      </div>
    </div>
  );
}
