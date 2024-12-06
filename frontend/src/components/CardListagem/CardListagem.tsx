"use client";

import Image from "next/image";

import "./style.scss";
import Star from "../UI/Star";

interface CardListagem {
  title: string;
  subtitle: string;
  onClickItem?: () => void;
  showFavorite?: boolean;
  idModalEdit?: string;
  idModalDelete?: string;
}

export default function CardListagem({
  title,
  subtitle,
  onClickItem,
  showFavorite,
  idModalEdit,
  idModalDelete,
}: Readonly<CardListagem>) {
  return (
    <div className="card-listagem" onClick={onClickItem}>
      <div className="card-listagem-text">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="buttons-area">
        {showFavorite ? (
          <Star color={"#F17F0C"} />
        ) : (
          <button
            className="button-edit"
            data-bs-toggle="modal"
            data-bs-target={`#${idModalEdit}`}
          >
            <Image
              src="/assets/images/edit.svg"
              alt="edit button"
              width={50}
              height={50}
            />
          </button>
        )}
        {!!idModalDelete && (
          <button data-bs-toggle="modal" data-bs-target={`#${idModalDelete}`}>
            <Image
              src="/assets/images/delete.svg"
              alt="delete button"
              width={50}
              height={50}
            />
          </button>
        )}
      </div>
    </div>
  );
}
