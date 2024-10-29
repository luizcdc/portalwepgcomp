"use client";
import backgroundOrientacao from "@/assets/images/background_orientacao.svg";

export default function Orientacao() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundOrientacao.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "1300px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
      <div className='text-white text-align-center fs-2 fw-bold'>
        Orientações
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <div>
          Este evento é uma excelente oportunidade para estudantes apresentarem
          e discutirem suas pesquisas, além de {"\n"} receberem feedback valioso
          de colegas e professores.{"\n"} É também uma chance de se envolver com
          a comunidade acadêmica e contribuir para o avanço do conhecimento na
          área de Ciência da Computação.
        </div>
        
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        >
          <div className='fw-bold'>Datas Importantes:</div>

          <div className='d-flex flex-diretcion-row align-items-center gap-2'>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            ></div>
            <div className='orientacaoTextDate'>
              Data limite para submissão: 27 de outubro de 2024.
            </div>
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
            <div className='orientacaoTextDate'>
              O evento será realizado de 12 a 14 de novembro de 2024.
            </div>
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
        fontWeight: "bold",
        marginTop: "40px"
      }}>
        Ver todas as orientações
      </div>
    </div>
  );
}
