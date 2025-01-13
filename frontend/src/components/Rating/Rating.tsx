"use client"

import "./Rating.css";
import { useEffect, useState } from "react";
import StarRating from "../UI/StarRating";

interface RatingProps{
    value: number;
    onChange: (value: number) => void;
}

export default function Rating({value, onChange}: RatingProps){

    const [rating, setRating]= useState<number>(value || 0);
    useEffect(() => {
        onChange(rating);
    },[rating]);

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