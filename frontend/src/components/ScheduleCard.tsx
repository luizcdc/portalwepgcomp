'use client'
import Image from 'next/image'
import PersonIcon from '@/assets/images/person_icon.svg'

import {Poppins} from "next/font/google"
import { useState } from 'react';

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});


export default function ScheduleCard({ type, title, author }: {  type: string, title: string, author: string }) {
    const [over, setOver] = useState<boolean>(false)

    if (type == "outro") {    
        return (
            <div style={{border: "1px solid #F17F0C", fontFamily:poppins.style.fontFamily, width: '100%'}} className="card" onMouseOver={()=>setOver(true)} onMouseOut={()=>setOver(false)}>
                <div className="card-body d-flex flex-column align-items-center">
                    <h6 style={{fontSize: '13px',fontWeight: '600', lineHeight: '19.5px', margin: '0'}}><strong>{title}</strong></h6>
                    <p style={{fontSize: '13px',fontWeight: '400', lineHeight: '28px', margin: '0'}}>{author}</p>
                </div>
            </div>
        )
    }  return (
        <div className="card" style={{border: "1px solid #F17F0C", fontFamily:poppins.style.fontFamily, width: '100%'}} onMouseOver={()=>setOver(true)} onMouseOut={()=>setOver(false)}>
            <div className="card-body d-flex flex-row align-items-center gap-2">
                <div>
                    <Image
                        src={PersonIcon}
                        alt="PGCOMP Logo"
                        width={65}
                        height={65}
                        priority={true}
                    />
                </div>
                <div>
                    {author ? <h6 style={{fontSize: '13px',fontWeight: '600', lineHeight: '19.5px', margin: '0'}}><strong>{author}</strong></h6> : ''}
                    <p style={{fontSize: '13px',fontWeight: '400', lineHeight: '28px', margin: '0'}}>{title}</p>
                </div>
            </div>
        </div>
    )
};
