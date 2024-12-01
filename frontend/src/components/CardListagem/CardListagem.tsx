"use client";

import Image from "next/image";

import "./style.scss";
import Star from "../UI/Star";

interface CardListagem {
  title: string;
  subtitle: string;
  onClick: () => void;
  onClickItem?: () => void;
  showFavorite?: boolean;
}

export default function CardListagem({
  title,
  subtitle,
  onClick,
  onClickItem,
  showFavorite,
}: Readonly<CardListagem>) {
  return (
    <div className="card-listagem">
      <div className="card-listagem-text" onClick={onClickItem}>
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <button onClick={onClick}>
        {showFavorite ? <Star color={"#F17F0C"} /> : <Image src="/assets/images/edit.svg" alt="" width={50} height={50} />}
      </button>
    </div>
  );
}
