import Image from "next/image";

import "./style.scss";

export default function Premiacao({
  categoria,
  premiacoes,
  avaliadores,

}: PremiacaoCategoriaProps) {
  return (
    <div className="d-grid gap-3 mb-5 premiacao">
      <div className="ms-5">
        <h1 className="fw-bold title">{`Melhores Apresentações - ${categoria === 'banca' ? 'Banca' : categoria === 'avaliadores' ? 'Avaliadores' : 'Público'}`}</h1>
        <h5 className="text-black">{`
                    ${categoria === 'banca' ? 'Ranking das melhores apresentações por voto da banca avaliadora'
                        : categoria === 'avaliadores' ? 'Ranking dos melhores/maiores avaliadores da edição'
                            : categoria === 'publico' ? 'Ranking das melhores apresentações por voto da audiência'
                                : ''}
                    `}
        </h5>
        {premiacoes.length === 0 && categoria !== "avaliadores" ? (
          <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
            <h4 className="empty-list mb-0">
              <Image
                src="/assets/images/empty_box.svg"
                alt="Lista vazia"
                width={90}
                height={90}
              />
              Essa lista ainda está vazia
            </h4>
          </div>
        ) : premiacoes.length === 0 && categoria === "avaliadores" ? (
          avaliadores.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3 mt-4 me-5"
            >
              <div className="text-black">
                <h6
                  className={`text-black fw-semibold ${
                    !item.name ? "mb-0" : ""
                  }`}
                >
                  {item.name}
                </h6>
                {item.email && (
                  <h6 className="text-black mb-0">{item.email}</h6>
                )}
              </div>
            </div>
          ))
        ): (
          premiacoes.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3 mt-4 me-5"
            >
              <div className="text-black">
                <h6
                  className={`text-black fw-semibold ${
                    !item.submission.mainAuthor.name ? "mb-0" : ""
                  }`}
                >
                  {item.submission.title}
                </h6>
                {item.submission.mainAuthor.name && (
                  <h6 className="text-black mb-0">{item.submission.mainAuthor.name}</h6>
                )}
              </div>
              <div className="text-end">
                <h4 className="mb-0 text-black fw-bold">
                  {categoria === "banca" ? item.evaluatorsAverageScore :
                  categoria === "publico" ? item.publicAverageScore :
                  ""}
                </h4>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
