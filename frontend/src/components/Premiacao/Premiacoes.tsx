import PremiacaoCategoria from './PremiacaoCategoria';

export default function Premiacoes({ categoria }: { categoria: "banca" | "avaliadores" | "publico" }) {
    const premiacoesPublico: { titulo: string; subtitulo: string; }[] = [
        // { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
        // { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
        // { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
    ];

    const premiacoesBanca: { titulo: string; subtitulo: string; }[] = [
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
    ];

    const premiacoesAvaliadores: { titulo: string; subtitulo: string; }[] = [
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)' },
    ];

    const getAwards = () => {
        switch (categoria) {
            case "publico":
                return premiacoesPublico;
            case "banca":
                return premiacoesBanca;
            case "avaliadores":
                return premiacoesAvaliadores;
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