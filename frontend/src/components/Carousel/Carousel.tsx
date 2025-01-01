"use client";
import "./Carousel.scss";
import { CarouselMock } from "@/mocks/Carousel";

import Link from "next/link";
import CarouselSlide from "./CarouselSlide";
import { useEdicao } from "@/hooks/useEdicao";
import { formatDateEvent, formatDateUniq } from "@/utils/formatDate";
import { useAuth } from "@/hooks/useAuth";

export default function Carousel() {
  const { Edicao } = useEdicao();
  const { signed } = useAuth();
  const { slide1, slide2, slide3 } = CarouselMock;

  return (
    <div
      id="carousel-wepgcomp"
      className="carousel slide carousel-component"
      data-bs-ride="carousel"
      data-bs-interval="6000"
    >
      <div className="carousel-inner">
        <CarouselSlide
          imageUrl={slide1.backgroundUrl || ""}
          slideIndex="0"
          isActive
        >
          <h2 className="display-4 text-white title">
            {Edicao?.name || "Carregando..."}
          </h2>
          <p className="lead">{Edicao?.description || "Carregando..."}</p>

          <p className="lead fw-semibold">
            {Edicao?.startDate
              ? formatDateEvent(Edicao?.startDate, Edicao?.endDate)
              : "Carregando..."}
          </p>

          <Link
            className="btn btn-outline-light mt-3 px-4 py-2 schedule-button"
            href="#Programacao"
          >
            {slide1.labelButton}
          </Link>
        </CarouselSlide>

        <CarouselSlide imageUrl={slide2.backgroundUrl || ""} slideIndex="1">
          <h2 className="display-4 title">{slide2.title}</h2>
          <div className="slide-2-content">
            <div className="concept-content">
              <p className="lead concept-subtitle fw-semibold">
                {" "}
                {slide2.concept_subtitles[0]}
              </p>
              <p className="lead five-subtitle ">
                {slide2.concept_subtitles[1]}
              </p>
              <p className="lead fs-2 capes-subtitle fw-semibold">
                {slide2.concept_subtitles[2]}
              </p>
            </div>
            <div className="info-subtitles">
              <p className="lead">{slide2.subtitles[0]}</p>
            </div>
          </div>
        </CarouselSlide>

        <CarouselSlide imageUrl={slide3.backgroundUrl || ""} slideIndex="2">
          <h2 className="display-4 title">{slide3.title}</h2>
          <p className="lead">
            Inscrições: até {formatDateUniq(Edicao?.startDate)}
          </p>
          <p className="lead">
            Data do evento:{" "}
            {formatDateEvent(Edicao?.startDate, Edicao?.endDate)}
          </p>
          <p className="lead">
            Data limite para submissão:{" "}
            {formatDateUniq(Edicao?.submissionDeadline)}
          </p>

          {signed ? (
            ""
          ) : (
            <Link
              className="btn btn-outline-light mt-3 px-4 py-2 schedule-button"
              href="/cadastro"
            >
              {slide3.labelButton}
            </Link>
          )}
        </CarouselSlide>
      </div>
    </div>
  );
}
