import Image from 'next/image';
import './style.scss';

interface PremiacaoItem {
  titulo: string;
  subtitulo: string;
}

interface PremiacaoListProps {
  titulo: string;
  descricao: string;
  premiacoes: PremiacaoItem[];
}

export default function Premiacao({ titulo, descricao, premiacoes }: PremiacaoListProps) {
  return (
    <div className="d-grid gap-3 mb-5">
      <div className="ms-5">
        <h1 className="fw-bold title">{titulo}</h1>
        <h5 className="text-black">{descricao}</h5>

        {premiacoes.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
            <p className="empty-list mb-0">
              <Image
                src="/assets/images/empty_box.svg"
                alt="Lista vazia"
                width={90}
                height={90}
              />
              Essa lista ainda está vazia
            </p>
          </div>
        ) : (
          premiacoes.map((item, index) => (
            <div key={index} className="d-flex align-items-center justify-content-between border border-3 border-solid custom-border p-3 mt-4 me-5">
              <div className="text-black">
                <p className={`text-black fw-semibold ${!item.subtitulo ? 'mb-0' : ''}`}>{item.titulo}</p>
                {item.subtitulo && <p className="text-black mb-0">{item.subtitulo}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
