"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import PresentationCard from "@/components/CardApresentacao/PresentationCard";
import CardListagem from "@/components/CardListagem/CardListagem";
import Banner from "@/components/UI/Banner";

import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";

export function mapCardList(
  list: any[],
  title = "title",
  subtitle = "subtitle",
  description = "description"
) {
  return list.map((l) => ({
    title: l[title],
    subtitle: l[subtitle],
    description: l[description],
    ...l,
  }));
}

interface ListagemProps {
  title: string;
  labelAddButton?: string;
  isAddButtonDisabled?: boolean;
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
  onEdit?: (id: string) => void;
  onClear?: () => void;
  fullInfo?: boolean;
}

export default function Listagem({
  idModal,
  title,
  labelAddButton,
  isAddButtonDisabled,
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
  onEdit,
  onClear,
  fullInfo,
}: Readonly<ListagemProps>) {
  const pathname = usePathname();
  const { Edicao } = useEdicao();

  return (
    <div className="listagem-template">
      <Banner title={title} />
      <div className="listagem-template-content">
        <div className="listagem-template-user-area">
          {labelAddButton && !!Edicao?.isActive ? (
            <button
              type="button"
              data-bs-toggle={idModal ? "modal" : undefined}
              data-bs-target={idModal ? `#${idModal}` : undefined}
              onClick={idModal ? onClear : onAddButtonClick}
              disabled={isAddButtonDisabled}
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
              style={{
                visibility: isMyPresentation ? "hidden" : "visible",
                minWidth: "350px",
              }}
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
            cardsList?.map((card) =>
              !fullInfo ? (
                <CardListagem
                  key={card.name}
                  title={card?.title || "Sem Título"}
                  subtitle={card.subtitle}
                  generalButtonLabel={generalButtonLabel}
                  idGeneralModal={
                    card?.type == "Presentation" && !!card?.presentations.length
                      ? idGeneralModal
                      : ""
                  }
                  idModalEdit={
                    pathname?.includes("edicoes")
                      ? "editarEdicaoModal"
                      : idModal
                  }
                  onClickItem={() => onClickItem && onClickItem(card)}
                  onEdit={() => onEdit && onEdit(card?.id ?? "")}
                  onDelete={() => onDelete && onDelete(card?.id ?? "")}
                />
              ) : (
                <PresentationCard
                  key={card.name}
                  id={card.id}
                  title={card.title}
                  subtitle={card.subtitle}
                  name={card.name}
                  pdfFile={card.pdfFile}
                  presentationData={card.startTime}
                  email={card.email}
                  advisorName={card.advisorName}
                  onDelete={() => onDelete && onDelete(card.id ?? "")}
                />
              )
            )}
          {!!cardsList.length &&
            isFavorites &&
            cardsList?.map((card) =>
              !fullInfo ? (
                <CardListagem
                  key={card.name}
                  title={card.title}
                  subtitle={card.subtitle}
                  showFavorite
                  onClickItem={() => onClickItem && onClickItem(card)}
                />
              ) : (
                <PresentationCard
                  key={card.name}
                  id={card.id}
                  title={card.title}
                  subtitle={card.subtitle}
                  name={card.name}
                  pdfFile={card.pdfFile}
                  email={card.email}
                  advisorName={card.advisorName}
                  onDelete={() => onDelete && onDelete(card.id ?? "")}
                />
              )
            )}
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
