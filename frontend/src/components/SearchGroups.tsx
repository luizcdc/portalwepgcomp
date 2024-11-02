"use client";
import backgroundGruposPesquisa from "@/assets/images/background_gruposPesquisa.svg";
import {Poppins} from "next/font/google"

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function SearchGroups() {
  return (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}    
    >
      <div className='text-center fs-1'
      style={{
        color: "#054B75",
        fontWeight: 700,
        fontFamily:poppins.style.fontFamily,}}>

        Grupos de Pesquisa
      </div>

      <div
        style={{
            backgroundImage: `url(${backgroundGruposPesquisa.src})`,
            backgroundSize: "cover",
            width: "80%",
            height: "440px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin:"50px"
            
          }}
        > 
      </div>
    </div>
  );
}
