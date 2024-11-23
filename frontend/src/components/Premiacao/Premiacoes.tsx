import { premiacoesAvaliadoresMock, premiacoesBancaMock, premiacoesPublicoMock } from '@/mocks/Premiacao';
import PremiacaoCategoria from './PremiacaoCategoria';

export default function Premiacoes({ categoria }: { categoria: "banca" | "avaliadores" | "publico" }) {
    const getAwards = () => {
        switch (categoria) {
            case "banca":
                return premiacoesBancaMock;
            case "avaliadores":
                return premiacoesAvaliadoresMock;
            case "publico":
                return premiacoesPublicoMock;
            default:
                return [];
        }
    };

    return (
        <div className="d-flex flex-column premiacao-list">
            <PremiacaoCategoria
                titulo={`Melhores Apresentações - ${categoria === 'banca' ? 'Banca' : categoria === 'avaliadores' ? 'Avaliadores' : 'Público'}`}
                descricao={`
                    ${categoria === 'banca' ? 'Ranking das melhores apresentações por voto da banca avaliadora'
                        : categoria === 'avaliadores' ? 'Ranking dos melhores/maiores avaliadores da edição'
                            : categoria === 'publico' ? 'Ranking das melhores apresentações por voto da audiência'
                                : ''}
                    `}
                premiacoes={getAwards()}
            />
        </div>
    );
}