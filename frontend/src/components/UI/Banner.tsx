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
          style={{
            fontSize: "70px",
            fontWeight: "700",
            lineHeight: "80px",
            textAlign: "center",
          }}
        >
          {title}
        </h1>
        <div></div>
      </CarouselSlide>
    </>
  );
}
