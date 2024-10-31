"use client";

interface CarouselSlideProps {
    imageUrl: string,
    isActive?: boolean
}

export default function CarouselSlide({imageUrl, isActive}: CarouselSlideProps ) {
   

    return (
        <div className={`carousel-item ${isActive ? 'active' : ''}`} style={{ marginBottom: "40px"}}>
        <div 
          style={{
              backgroundImage: `url(${imageUrl})`,      
              backgroundSize: "cover",
              backgroundPosition: "bottom",
              width: "100vw",
              height: '700px',
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",   
              position: 'relative',
              zIndex: 2 ,
             
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
          <span style={{backgroundColor: "rgb(241, 127, 12, 0.26)", width: "100%", height:"300px", position: "absolute", bottom: "180px", right: "150px", borderRadius: "80px", transform: "rotate(13deg)",  zIndex: 1 }} />
          
      </div>
    );
}