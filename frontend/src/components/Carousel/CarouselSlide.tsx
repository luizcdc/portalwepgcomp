"use client";

import { ReactNode } from "react";
import Image from "next/image";

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
        className="carousel-slide-content"
      >
        <Image
          src={imageUrl}
          alt="Imagem do carousel"
          fill={true}
          priority={isActive}
          className="image-background"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
        />
        {children}
      </div>
    </div>
  );
}
