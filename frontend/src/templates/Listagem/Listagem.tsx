"use client";

import CardListagem from "@/components/CardListagem/CardListagem";
import CarouselSlide from "@/components/Carousel/CarouselSlide";
import { CarouselMock } from "@/mocks/Carousel";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

import "./style.scss";

interface ListagemProps {
  title: string;
  labelAddButton: string;
  searchPlaceholder: string;
  labelListCardsButton: string;
  cardsList: any[];
}

export default function Listagem({
  title,
  labelAddButton,
  labelListCardsButton,
  searchPlaceholder,
  cardsList,
}: Readonly<ListagemProps>) {
  return (
    <div className="listagem-template">
      <CarouselSlide imageUrl={CarouselMock.slide1.backgroundUrl} isActive>
        <h2 className="display-4 title">{title}</h2>
      </CarouselSlide>
      <div className="listagem-template-content">
        <div className="listagem-template-user-area">
          <button>
            {labelAddButton}{" "}
            <Image src="/assets/images/add.svg" alt="" width={24} height={24} />
          </button>
          <div className="input-group listagem-template-content-input">
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
                  ? `${formatDate(card.startAt, card.endAt)}`
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
