"use client";

import { ReactNode } from "react";

import "./Carousel.css";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500"],
  subsets: ["latin"],
});

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
    <div
      className={`carousel-item ${isActive ? "active" : ""} carousel-slide`}
      style={{ fontFamily: poppins.style.fontFamily }}
    >
      <div
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
        className="carousel-slide-content"
      >
        {children}
      </div>
      <span className="shaddow-span" />
    </div>
  );
}
