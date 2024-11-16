"use client"

import "./Rating.css";
import { useState } from "react";
import Image from "next/image";

interface RatingProps{
    isActive: boolean;
}

export default function Rating(){

    return(

        <div className="rating">
            <div className="star">
            <Image
                src={"/assets/images/star.svg"}
                alt="RatingStar"
                width={37}
                height={35}
            />
            </div>

            <div className="star">
            <Image
                src={"/assets/images/star.svg"}
                alt="RatingStar"
                width={37}
                height={35}
            />
            </div>

            <div className="star">
            <Image
                src={"/assets/images/star.svg"}
                alt="RatingStar"
                width={37}
                height={35}
            />
            </div>

            <div className="star">
            <Image
                src={"/assets/images/star.svg"}
                alt="RatingStar"
                width={37}
                height={35}
            />
            </div>
            
            <div className="star">
            <Image
                src={"/assets/images/star.svg"}
                alt="RatingStar"
                width={37}
                height={35}
            />
            </div>
        </div>
    );
}