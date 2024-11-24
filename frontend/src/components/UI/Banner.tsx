"use client";

import CarouselSlide from "../Carousel/CarouselSlide";

interface BannerProps {
  title: string;
}

export default function Banner({ title }: BannerProps) {
  return (
    <>
      <CarouselSlide imageUrl={"/assets/images/slide1.svg"} isActive>
        <h1
          className='fw-bold text-center text-white'
          style={{
            fontSize: "70px",
            lineHeight: "80px",
          }}
        >
          {title}
        </h1>
        <div></div>
      </CarouselSlide>
    </>
  );
}
