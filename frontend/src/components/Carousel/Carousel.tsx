"use client";

import "./Carousel.css";

import { CarouselMock } from "@/mocks/Carousel";

import CarouselSlide from "./CarouselSlide";

export default function Carousel() {
  const { slide1, slide2, slide3 } = CarouselMock;

  return (
    <div
      id="carousel-wepgcomp"
      className="carousel slide carousel-component"
      data-bs-ride="carousel"
      data-bs-interval="6000"
    >
      <div className="carousel-indicators indicators-content">
        <button
          type="button"
          data-bs-target="#carousel-wepgcomp"
          data-bs-slide-to="0"
          className="indicators-buttons active"
          aria-current="true"
          aria-label="Slide 1"
        />
        <button
          type="button"
          data-bs-target="#carousel-wepgcomp"
          data-bs-slide-to="1"
          className="indicators-buttons"
          aria-label="Slide 2"
        />
        <button
          type="button"
          data-bs-target="#carousel-wepgcomp"
          data-bs-slide-to="2"
          className="indicators-buttons"
          aria-label="Slide 3"
        />
      </div>

      <div className="carousel-inner">
        <CarouselSlide imageUrl={slide1.backgroundUrl || ""} isActive>
          <h2 className="display-4 title">{slide1.title}</h2>
          <p className="lead">{slide1.subtitles[0]}</p>

          <p className="lead fw-semibold">{slide1.subtitles[1]}</p>
          <button className="btn btn-outline-light mt-3 px-4 py-2 schedule-button">
            {slide1.labelButton}
          </button>
        </CarouselSlide>

        <CarouselSlide imageUrl={slide2.backgroundUrl || ""}>
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
              <p className="lead">{slide2.subtitles[1]}</p>
            </div>
          </div>
        </CarouselSlide>

        <CarouselSlide imageUrl={slide3.backgroundUrl || ""}>
          <h2 className="display-4 title">{slide3.title}</h2>
          <p className="lead">{slide3.subtitles[0]}</p>
          <p className="lead">{slide3.subtitles[1]}</p>
          <p className="lead">{slide3.subtitles[2]}</p>

          <button className="btn btn-outline-light mt-3 px-4 py-2 schedule-button">
            {slide3.labelButton}
          </button>
        </CarouselSlide>
      </div>
    </div>
  );
}
