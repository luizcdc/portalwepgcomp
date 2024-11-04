"use client";

import { ReactNode } from "react";

import "./Carousel.css";

interface CarouselSlideProps {
  imageUrl: string;
  children: ReactNode[];
  isActive?: boolean;
}

export default function CarouselSlide({
  imageUrl,
  isActive,
  children,
}: Readonly<CarouselSlideProps>) {
  return (
    <div className={`carousel-item ${isActive ? "active" : ""} carousel-slide`}>
      <div
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
        className='carousel-slide-content'
      >
        {children}
      </div>
      <span className='shaddow-span' />
    </div>
  );
}
