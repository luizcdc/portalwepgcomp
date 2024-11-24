"use client";

import { ReactNode } from "react";
import "./Carousel.scss";

interface CarouselSlideProps {
  imageUrl: string;
  children: ReactNode[] | ReactNode;
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
        className='carousel-slide-content'
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        {children}
      </div>
    </div>
  );
}
