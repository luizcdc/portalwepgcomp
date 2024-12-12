"use client";

import Image from "next/image";

import "./style.scss";
import Star from "../UI/Star";

import { useSweetAlert } from "@/hooks/useAlert";

interface CardListagem {
  title: string;
  subtitle: string;
  showFavorite?: boolean;
  idModalEdit?: string;
  onClickItem?: () => void;
  onDelete?: () => void;
}

export default function CardListagem({
  title,
  subtitle,
  onClickItem,
  showFavorite,
  idModalEdit,
  onDelete,
}: Readonly<CardListagem>) {
  const { showAlert } = useSweetAlert();

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
        {!!onDelete && (
          <button
            onClick={() => {
              showAlert({
                title: "Você tem certeza?",
                text: "Ao deletar você não poderá reverter essa ação.",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#CF000A",
                cancelButtonText: "Cancelar",
                showConfirmButton: true,
                confirmButtonColor: "#019A34",
                confirmButtonText: "Deletar",
              }).then((result) => {
                if (result.isConfirmed) {
                  onDelete();
                }
              });
            }}
          >
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
