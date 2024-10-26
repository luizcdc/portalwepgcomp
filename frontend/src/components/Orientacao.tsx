
export default function Orientacao(){
    return(
<div> 
    <div className="orientacao-title">Orientações</div>

    <div className="orientacao-text">
     <p className="orientacao-summary">
      Este evento é uma excelente oportunidade para estudantes apresentarem e discutirem suas pesquisas, 
      além de receberem feedback valioso de colegas e professores. É também uma chance de se envolver com a comunidade acadêmica 
      e contribuir para o avanço do conhecimento na área de Ciência da Computação.
     </p>

     <p className="orientacao-important">
      Datas Importantes:
     </p>

     <div className="orientacao-date">
        <i className="bi bi-circle-fill"></i>
      <p className="orientacao-text-date">
      Data limite para submissão: 27 de outubro de 2024.
      </p>
     </div>

     <div className="orientacao-date">
        <i className="bi bi-circle-fill"></i>
      <p className="orientacao-text-date">
       O evento será realizado de 12 a 14 de novembro de 2024.
      </p>
     </div>
    
    </div>

    <div className="orientacao-button">
     <button className="orientacao-button-text">Ver todas as orientações</button>
    </div>
</div>
    );
}