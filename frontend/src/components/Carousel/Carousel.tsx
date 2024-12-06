"use client";
import "./Carousel.scss";
import { CarouselMock } from "@/mocks/Carousel";

import Link from "next/link";
import CarouselSlide from "./CarouselSlide";

export default function Carousel() {
  const { slide1, slide2, slide3 } = CarouselMock;

  return (
    <div
      id='carousel-wepgcomp'
      className='carousel slide carousel-component'
      data-bs-ride='carousel'
      data-bs-interval='6000'
    >
      <div className='carousel-inner'>
        <CarouselSlide imageUrl={slide1.backgroundUrl || ""} slideIndex="0" isActive>
          <h2 className='display-4 text-white title'>{slide1.title}</h2>
          <p className='lead'>{slide1.subtitles[0]}</p>

          <p className='lead fw-semibold'>{slide1.subtitles[1]}</p>

          <Link
            className='btn btn-outline-light mt-3 px-4 py-2 schedule-button'
            href='#Programacao'
          >
            {slide1.labelButton}
          </Link>
        </CarouselSlide>

        <CarouselSlide imageUrl={slide2.backgroundUrl || ""} slideIndex="1">
          <h2 className='display-4 title'>{slide2.title}</h2>
          <div className='slide-2-content'>
            <div className='concept-content'>
              <p className='lead concept-subtitle fw-semibold'>
                {" "}
                {slide2.concept_subtitles[0]}
              </p>
              <p className='lead five-subtitle '>
                {slide2.concept_subtitles[1]}
              </p>
              <p className='lead fs-2 capes-subtitle fw-semibold'>
                {slide2.concept_subtitles[2]}
              </p>
            </div>
            <div className='info-subtitles'>
              <p className='lead'>{slide2.subtitles[0]}</p>
              <p className='lead'>{slide2.subtitles[1]}</p>
            </div>
          </div>
        </CarouselSlide>

        <CarouselSlide imageUrl={slide3.backgroundUrl || ""} slideIndex="2">
          <h2 className='display-4 title'>{slide3.title}</h2>
          <p className='lead'>{slide3.subtitles[0]}</p>
          <p className='lead'>{slide3.subtitles[1]}</p>
          <p className='lead'>{slide3.subtitles[2]}</p>

          <Link
            className='btn btn-outline-light mt-3 px-4 py-2 schedule-button'
            href='/Login'
          >
            {slide3.labelButton}
          </Link>
        </CarouselSlide>
      </div>
    </div>
  );
}
