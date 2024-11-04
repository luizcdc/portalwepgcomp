"use client";
import backgroundOrientacao from "@/assets/images/background_orientacao.svg";

export default function Orientacao() {
  return (
    <div
      id='Orientacao'
      style={{
        backgroundImage: `url(${backgroundOrientacao.src})`,
        backgroundSize: "cover",
        width: "100%",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: "8px",
        color: "white",
      }}
    >
      <div className='text-white text-center fs-1 fw-bold'>Orientações</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        <div>
          Este evento é uma excelente oportunidade para estudantes apresentarem
          e discutirem suas pesquisas, além de <br />
          receberem feedback valioso de colegas e professores.
          <br /> Clique em Ver todas as orientações para ter mais informações
          sobre o evento.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className='fw-bold'>Datas Importantes:</div>

          <div className='d-flex flex-direction-row align-items-center gap-2'>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            ></div>
            <div>Data limite para submissão: 27 de outubro de 2024.</div>
          </div>

          <div className='d-flex flex-direction-row align-items-center gap-2'>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            ></div>
            <div>O evento será realizado de 12 a 14 de novembro de 2024.</div>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "solid",
          borderColor: "white",
          width: "300px",
          height: "60px",
          borderRadius: "12px",
          borderWidth: "1px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600",
          marginTop: "40px",
          fontSize: "18px",
        }}
      >
        Ver todas as orientações
      </div>
    </div>
  );
}
