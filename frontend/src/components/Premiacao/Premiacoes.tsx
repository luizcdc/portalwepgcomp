import PremiacaoCategoria from './PremiacaoCategoria';

export default function Premiacoes() {
    const premiacoesPublico: { titulo: string; subtitulo: string; medalha: 'gold' | 'silver' | 'bronze' }[] = [
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)', medalha: 'gold' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)', medalha: 'silver' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)', medalha: 'bronze' },
    ];

    const premiacoesBanca: { titulo: string; subtitulo: string; medalha: 'gold' | 'silver' | 'bronze' }[] = [
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)', medalha: 'gold' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)', medalha: 'silver' },
        { titulo: 'Nome da apresentação', subtitulo: 'Nome do(a) autor(a)', medalha: 'bronze' },
    ];
    
    const premiacoesAvaliadores: { titulo: string; medalha: 'gold' | 'silver' | 'bronze' }[] = [
        { titulo: 'Nome do usuário', medalha: 'gold' },
        { titulo: 'Nome do usuário', medalha: 'silver' },
        { titulo: 'Nome do usuário', medalha: 'bronze' },
    ];

    return (
        <div className="d-flex flex-column premiacao-list">
            <PremiacaoCategoria
                titulo="Melhores Apresentações - Público"
                descricao="Ranking das melhores apresentações por voto da audiência"
                premiacoes={premiacoesPublico}
                medalWidth={50}
                medalHeight={50}
            />
            <PremiacaoCategoria
                titulo="Melhores Apresentações - Banca"
                descricao="Ranking das melhores apresentações por voto da banca avaliadora"
                premiacoes={premiacoesBanca}
                medalWidth={50}
                medalHeight={50}
            />
            <PremiacaoCategoria
                titulo="Melhores Avaliadores"
                descricao="Ranking dos melhores/maiores avaliadores da edição"
                premiacoes={premiacoesAvaliadores}
                medalWidth={35}
                medalHeight={35}
            />
        </div>
    );
}