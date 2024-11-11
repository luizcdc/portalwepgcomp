"use client";

import Image from "next/image";

import "./style.scss";

interface CardListagem {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function CardListagem({
  title,
  subtitle,
  onClick,
}: Readonly<CardListagem>) {
  return (
    <div className="card-listagem">
      <div className="card-listagem-text">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
      <button onClick={onClick}>
        <Image src="/assets/images/edit.svg" alt="" width={50} height={50} />
      </button>
    </div>
  );
}
