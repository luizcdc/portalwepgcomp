"use client"

import "./Rating.css";
import { useState } from "react";
import StarRating from "../UI/StarRating";

export default function Rating(){

    const [rating, setRating]= useState<number>(0);

    return(

        <div className="rating">
            <div className="star" onClick={() => setRating(1)}>
                <StarRating color={rating>=1?"#FFA90F":"#555555"} />
            </div>

            <div className="star" onClick={() => setRating(2)}>
                <StarRating color={rating>=2?"#FFA90F":"#555555"}/>
            </div>

            <div className="star" onClick={() => setRating(3)}>
                <StarRating color={rating>=3?"#FFA90F":"#555555"}/>
            </div>

            <div className="star" onClick={() => setRating(4)}>
                <StarRating color={rating>=4?"#FFA90F":"#555555"}/>
            </div>

            <div className="star" onClick={() => setRating(5)}>
                <StarRating color={rating>=5?"#FFA90F":"#555555"}/>
            </div>
        </div>
    );
}