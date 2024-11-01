import Image from 'next/image'
import {Poppins} from "next/font/google"
import ScheduleCard from "./ScheduleCard"

const ScheduleCardProps = {
    type:"outro",
    title:"Abertura (Autitório A)",
    author:"Prof. Daniela Barreiro Claro (coordenadora do PGCOMP-UFBA)",
}

const ScheduleCardProps2 = {
    type:"outro",
    title:"Abertura (Autitório A)",
    autor:"Prof. Daniela Barreiro Claro (coordenadora do PGCOMP-UFBA)",
}

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

/*font-family: Poppins;
font-size: 50px;
font-weight: 700;
line-height: 80px;
text-align: center;
*/


export default function ScheduleSection() {

   return (
        <div className="card" style={{border: "1px solid #F17F0C", fontFamily:poppins.style.fontFamily}}>
            <ScheduleCard type={ScheduleCardProps.type} author={ScheduleCardProps.author} title={ScheduleCardProps.title}  />
            <ScheduleCard type={ScheduleCardProps.type} author={ScheduleCardProps.author} title={ScheduleCardProps.title}  />
            <ScheduleCard type={ScheduleCardProps.type} author={ScheduleCardProps.author} title={ScheduleCardProps.title}  />
            <ScheduleCard type={ScheduleCardProps.type} author={ScheduleCardProps.author} title={ScheduleCardProps.title}  />
        </div>
    )
};

