"use client";

import Slide1 from "@/assets/images/slide1.png";
import Slide2 from "@/assets/images/slide2.png";
import Slide3 from "@/assets/images/slide3.png";
import CarouselSlide from "./CarouselSlide";

export default function Carousel() {
    return(
        <div id="carousel-wepgcomp" className="carousel slide">
          <div className="carousel-indicators" style={{ bottom: 200, zIndex: 3}}>
            <button type="button" data-bs-target="#carousel-wepgcomp" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" style={{borderRadius:"50%", width:"15px", height: "15px"}}></button>
            <button type="button" data-bs-target="#carousel-wepgcomp" data-bs-slide-to="1" aria-label="Slide 2" style={{borderRadius:"50%", width:"15px", height: "15px"}}></button>
            <button type="button" data-bs-target="#carousel-wepgcomp" data-bs-slide-to="2" aria-label="Slide 3" style={{borderRadius:"50%", width:"15px", height: "15px"}}></button>
          </div>
          
          <div className="carousel-inner" >
            <CarouselSlide imageUrl={Slide1.src || ""} isActive />
            <CarouselSlide imageUrl={Slide2.src || ""}  />
            <CarouselSlide imageUrl={Slide3.src || ""} />
          </div>
          
        </div>
    );
}