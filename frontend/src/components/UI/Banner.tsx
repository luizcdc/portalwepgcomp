"use client";

import CarouselSlide from "../Carousel/CarouselSlide";

interface BannerProps {
  title: string;
}

export default function Banner({ title }: Readonly<BannerProps>) {
  return (
    <CarouselSlide
      imageUrl={"/assets/images/slide1.svg"}
      slideIndex="0"
      isActive
    >
      <h1
        className="fw-bold text-center text-white"
      >
        {title}
      </h1>
      <div></div>
    </CarouselSlide>
  );
}
