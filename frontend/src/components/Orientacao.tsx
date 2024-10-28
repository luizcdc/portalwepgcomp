"use client";
import backgroundOrientacao from "@/assets/images/background_orientacao.svg";

export default function Orientacao() {
  return (
    <div className="d-flex flex-direction-column justify-content-center align-items-center "
    style={{
        backgroundImage: `url(${backgroundOrientacao.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: '1300px',
        height: '500px'
      }}>
        
      <div className="orientacaoTitle">Orientações</div>

      <div className="orientacaoText">
        <p className="orientacaoSummary">
          Este evento é uma excelente oportunidade para estudantes apresentarem
          e discutirem suas pesquisas, além de receberem feedback valioso de
          colegas e professores. É também uma chance de se envolver com a
          comunidade acadêmica e contribuir para o avanço do conhecimento na
          área de Ciência da Computação.
        </p>

        <p className="orientacaoImportant">Datas Importantes:</p>

        <div className="orientacaoDate">
          <i className='bi bi-circle-fill'></i>
          <p className="orientacaoTextDate">
            Data limite para submissão: 27 de outubro de 2024.
          </p>
        </div>

        <div className="orientacaoDate">
          <i className='bi bi-circle-fill'></i>
          <p className="orientacaoTextDate">
            O evento será realizado de 12 a 14 de novembro de 2024.
          </p>
        </div>
      </div>

      <div className="orientacaoButton">
        <button className="orientacaoButtonText">
          Ver todas as orientações
        </button>
      </div>
    </div>
  );
}
