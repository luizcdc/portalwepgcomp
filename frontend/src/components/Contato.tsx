"use client"
import {Poppins} from "next/font/google"

const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export default function Contato(){
    return(
        <div style={{
        fontFamily:poppins.style.fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: "20px"
      }}>
            <div className="fs-1 fw-bold text-left">Contato</div>
            
            <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                alignItems: "flex-start"
            }}
            >
                
                <div>
                    <label className="form-label fs-6 fw-semibold">Nome:</label>
                    <input type="nome" className="form-control" id="name" placeholder="Insira seu nome"
                    style={{
                        width: "300px",
                        height: "40px",
                        borderWidth: "2px",
                    }} />
                </div>
                
                <div>
                    <label className="form-label fs-6 fw-semibold">E-mail:</label>
                    <input type="email" className="form-control" id="email" placeholder="Insira seu e-mail"
                    style={{
                        width: "300px",
                        height: "40px",
                        borderWidth: "2px",
                    }} />
                </div>

            </div>

            <div
>
                <label className="form-label fs-6 fw-semibold">Mensagem:</label>
                <input type="text" className="form-control" id="message" placeholder="Digite sua mensagem"
                style={{
                    width: "620px",
                    height: "137px",
                    borderWidth: "2px",
                }} />
            </div>

            <div
            style={{
                border: "solid",
                backgroundColor: "blue",
                color: "white",
                borderColor: "blue",
                borderRadius: "8px",
                width: "620px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "semibold",
            }}
            >Entrar</div>

        </div>
    )
}