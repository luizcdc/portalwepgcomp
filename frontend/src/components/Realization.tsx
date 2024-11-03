"use client";
import logo_jusbrasil from "@/assets/images/logo_jusbrasil.svg";
import logo_ufba from "@/assets/images/logo_ufba.svg";
import logo_computacao from "@/assets/images/logo_computacao.svg";
import {Poppins} from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function realizacao() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "100%",
      margin:"30px 100px"}}>

        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "50%",}}>
            
            <div style={{
                color: "black",
                fontWeight: 700,
                fontSize: "24px",
                fontFamily:poppins.style.fontFamily}}
                >
                Realização:
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%"}}>

                    <div style={{
                      backgroundImage: `url(${logo_computacao.src})`,
                      backgroundSize: "cover",
                      width: "221px",
                      height: "60px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      margin:"20px"}}></div>
                </div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "50%",}}>
            
            <div style={{
                color: "black",
                fontWeight: 700,
                fontSize: "24px",
                fontFamily:poppins.style.fontFamily}}
                >
                Apoio:
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center ",
                    width: "100%"}}>

                    <div style={{
                      backgroundImage: `url(${logo_ufba.src})`,
                      backgroundSize: "cover",
                      width: "138px",
                      height: "89px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      margin:"20px"}}></div>

                    <div style={{
                      backgroundImage: `url(${logo_jusbrasil.src})`,
                      backgroundSize: "cover",
                      width: "208px",
                      height: "32px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      margin:"20px"}}></div>
              </div>
        </div>
    </div>
  );
}
