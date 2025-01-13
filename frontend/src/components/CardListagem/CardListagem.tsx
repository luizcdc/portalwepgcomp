"use client";

import Image from "next/image";

import "./style.scss";
import Star from "../UI/Star";

import { useSweetAlert } from "@/hooks/useAlert";
import PresentationCard from "../CardApresentacao/PresentationCard";

interface CardListagem {
  id: string;
  title: string;
  subtitle: string;
  name: string;
  pdfFile: string;
  email: string;
  advisorName: string;
  showFavorite?: boolean;
  generalButtonLabel?: string;
  idModalEdit?: string;
  idGeneralModal?: string;
  onClickItem?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  fullInfo: boolean;
}

export default function CardListagem({
  id,
  title,
  subtitle,
  name,
  pdfFile,
  email,
  advisorName,
  onClickItem,
  generalButtonLabel,
  showFavorite,
  idGeneralModal,
  idModalEdit,
  onDelete,
  onEdit,
  fullInfo
}: Readonly<CardListagem>) {
  const { showAlert } = useSweetAlert();

  if (fullInfo) {
    return (<PresentationCard props={{id: id, title: title, subtitle: subtitle, name: name, pdfFile: pdfFile, email:email, advisorName:advisorName}}></PresentationCard>);
  }

  return (
    <div className="card-listagem" onClick={onClickItem}>
      <div className="card-listagem-text">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <div className="buttons-area">
        {!!idGeneralModal && !!generalButtonLabel && (
          <button
            className="button-general"
            data-bs-toggle="modal"
            data-bs-target={`#${idGeneralModal}`}
          >
            {generalButtonLabel}
          </button>
        )}
        {showFavorite ? (
          <Star color={"#F17F0C"} />
        ) : (
          <button data-bs-toggle="modal" data-bs-target={`#${idModalEdit}`}
            onClick={() => {  
              if (onEdit) {
                onEdit();
              }
            }}>
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
