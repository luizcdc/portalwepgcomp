import Image from 'next/image'
import PersonIcon from '@/assets/images/person_icon.svg'

import {Poppins} from "next/font/google"

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});


export default function ScheduleCard({ type, title, author }: {  type: String, title: string, author: String }) {

    if (type == "apresentacao") {    
        return (
            <div style={{border: "1px solid #F17F0C", fontFamily:poppins.style.fontFamily}} className="card">
                <div className="card-body d-flex flex-column align-items-center">
                    <h6 style={{fontSize: '13px',fontWeight: '600', lineHeight: '19.5px'}}><strong>{title}</strong></h6>
                    <p style={{fontSize: '13px',fontWeight: '400', lineHeight: '28px'}}>{author}</p>
                </div>
            </div>
        )
    }  return (
        <div className="card" style={{border: "1px solid #F17F0C", fontFamily:poppins.style.fontFamily}}>
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
                    <h6 style={{fontSize: '13px',fontWeight: '600', lineHeight: '19.5px'}}><strong>{author}</strong></h6>
                    <p style={{fontSize: '13px',fontWeight: '400', lineHeight: '28px'}}>{title}</p>
                </div>
            </div>
        </div>
    )
};
