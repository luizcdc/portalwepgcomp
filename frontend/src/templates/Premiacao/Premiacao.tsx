import Image from "next/image";

import "./style.scss";

export default function Premiacao({
  titulo,
  descricao,
  premiacoes,
}: PremiacaoListProps) {
  return (
    <div className="d-grid gap-3 mb-5 premiacao">
      <div className="ms-5">
        <h1 className="fw-bold title">{titulo}</h1>
        <h5 className="text-black">{descricao}</h5>

        {premiacoes.length === 0 ? (
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
        ) : (
          premiacoes.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3 mt-4 me-5"
            >
              <div className="text-black">
                <h6
                  className={`text-black fw-semibold ${
                    !item.subtitulo ? "mb-0" : ""
                  }`}
                >
                  {item.titulo}
                </h6>
                {item.subtitulo && (
                  <h6 className="text-black mb-0">{item.subtitulo}</h6>
                )}
              </div>
              <div className="text-end">
                <h4 className="mb-0 text-black fw-bold">{item.nota}</h4>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
