"use client";

import { ReactNode } from "react";
import "./Carousel.scss";

interface CarouselSlideProps {
  imageUrl: string;
  slideIndex: string;
  children: ReactNode[] | ReactNode;
  isActive?: boolean;
}

export default function CarouselSlide({
  imageUrl,
  slideIndex,
  isActive,
  children,
}: Readonly<CarouselSlideProps>) {
  return (
    <div className={`carousel-item ${isActive ? "active" : ""} carousel-slide`}>
      <div
        className='carousel-slide-content'
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        {children}
        <div className='carousel-indicators indicators-content mt-3'>
          <button
            type='button'
            data-bs-target='#carousel-wepgcomp'
            data-bs-slide-to='0'
            className={`indicators-buttons ${slideIndex == '0' ? "active" : ""}`}
            aria-current='true'
            aria-label='Slide 1'
          />
          <button
            type='button'
            data-bs-target='#carousel-wepgcomp'
            data-bs-slide-to='1'
            className={`indicators-buttons ${slideIndex == '1' ? "active" : ""}`}
            aria-label='Slide 2'
          />
          <button
            type='button'
            data-bs-target='#carousel-wepgcomp'
            data-bs-slide-to='2'
            className={`indicators-buttons ${slideIndex == '2' ? "active" : ""}`}
            aria-label='Slide 3'
          />
        </div>
      </div>
    </div>
  );
}
