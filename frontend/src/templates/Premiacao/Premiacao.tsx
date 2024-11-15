import Image from 'next/image';
import './style.scss';

interface PremiacaoItem {
  titulo: string;
  subtitulo?: string;
  medalha: 'gold' | 'silver' | 'bronze';
}

interface PremiacaoListProps {
  titulo: string;
  descricao: string;
  premiacoes: PremiacaoItem[];
  medalWidth: number;
  medalHeight: number;
}

function MedalhaIcon({ tipo, width, height }: { tipo: 'gold' | 'silver' | 'bronze'; width: number; height: number }) {
  const medalhas = {
    gold: '/assets/images/gold_medal.svg',
    silver: '/assets/images/silver_medal.svg',
    bronze: '/assets/images/bronze_medal.svg',
  };

  return <Image src={medalhas[tipo]} alt={`${tipo} medal`} width={width} height={height} />;
}

export default function Premiacao({ titulo, descricao, premiacoes, medalWidth, medalHeight }: PremiacaoListProps) {
  return (
    <div className="d-grid g-3 mb-5">
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
              <MedalhaIcon tipo={item.medalha} width={medalWidth} height={medalHeight} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
