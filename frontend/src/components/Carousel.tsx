"use client";
import Slide1 from "@/assets/images/slide1.png";
import Slide2 from "@/assets/images/slide2.png";
import Slide3 from "@/assets/images/slide3.png";

export default function Carousel() {
    return(
        <div id="carouselExampleIndicators" className="carousel slide">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselindicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" style={{borderRadius:"50%", width:"15px", height: "15px"}}></button>
    <button type="button" data-bs-target="#carouselindicators" data-bs-slide-to="1" aria-label="Slide 2" style={{borderRadius:"50%", width:"15px", height: "15px"}}></button>
    <button type="button" data-bs-target="#carouselindicators" data-bs-slide-to="2" aria-label="Slide 3" style={{borderRadius:"50%", width:"15px", height: "15px"}}></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active">
        <div 
        style={{
            backgroundImage: `url(${Slide1.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: '500px',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            color: "white"
        }}>
            <h2>WEPGCOMP 2024</h2>
            <p>Workshop de Estudantes da Pós-Graduação em Ciência da Computação do PGCOMP-UFBA</p>

            <h4>de 12 a 14 de novembro de 2024</h4>
            <button style={{ 
                color: "white",
                borderRadius: "20px",
                border: `2px solid white`,
                background: "transparent",
                padding: "5px  35px",
                fontWeight: 600,
                marginTop: "24px",
            }}>Confira a Programação</button>
        </div>
    </div>
    <div className="carousel-item">
      <div 
        style={{
            backgroundImage: `url(${Slide2.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: '500px',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "30px"
        }}>

        <h2> O WEPGCOMP</h2>
        
        <div style={{display: "flex", width: "80%"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <p style={{fontSize:"25px"}}>conceito</p>
                <p style={{fontSize:"130px", fontWeight: 900, lineHeight: "50px"}}>5</p>
                <p style={{fontSize:"25px", marginTop: "10px"}}>capes</p>
            </div>
            <div style={{display: "flex", flexDirection: "column", marginLeft: "40px"}}>
                <p>Workshop de Estudantes da Pós-Graduação em Ciência da Computação do  Programa de Pós Graduação em Ciência da Computação (PGCOMP) da Universidade Federal da Bahia (UFBA).</p>
                <p>O objetivo do evento é apresentar as pesquisas em andamento realizadas pelos alunos de doutorado (a partir do segundo ano), bem como propiciar um ambiente de troca de conhecimento e integração entre a comunidade.</p>
            </div>
        </div>
    </div>
    </div>
    <div className="carousel-item">
      <div 
        style={{
            backgroundImage: `url(${Slide3.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: '500px',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
        }}>

            <h2>DATAS IMPORTANTES</h2>
            <p style={{marginBottom: "5px"}}>Inscrições: até 14 de novembro de 2024.</p>
            <p style={{marginBottom: "5px"}}>Data do evento: 12 a 14 de novembro de 2024.</p>
            <p style={{marginBottom: "5px"}}>Data limite para submissão: 27 de outubro de 2024.</p>
          
            <button style={{ 
                color: "white",
                borderRadius: "20px",
                border: `2px solid white`,
                background: "transparent",
                padding: "5px  35px",
                fontWeight: 600,
                marginTop: "24px",
            }}>INSCREVA-SE JÁ!</button>
    </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
    );
}