import Image from 'next/image';
import { useEffect, useState } from 'react';

import { premiacoesAvaliadoresMock, premiacoesBancaMock, premiacoesPublicoMock } from '@/mocks/Premiacao';
import PremiacaoCategoria from './PremiacaoCategoria';

import "./style.scss";
import { useEdicao } from '@/hooks/useEdicao';
import { usePremiacao } from '@/hooks/usePremiacao';

export default function Premiacoes({ categoria }: { categoria: "banca" | "avaliadores" | "publico" }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { Edicao } = useEdicao();

    const { getPremiacoes } = usePremiacao();
    
    useEffect(() => {
        getPremiacoes(Edicao?.id);
    }, []);

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

    const filteredAwards = getAwards().filter((item) => item.titulo.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => b.nota - a.nota);

    return (
        <div className="d-flex flex-column premiacao-list">
            <div className="input-group ms-5 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Pesquise pelo nome da apresentação"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button
                    className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center"
                    type="button"
                    id="button-addon2"
                >
                    <Image
                        src="/assets/images/search.svg"
                        alt="Search icon"
                        width={24}
                        height={24}
                    />
                </button>
            </div>

            <PremiacaoCategoria
                titulo={`Melhores Apresentações - ${categoria === 'banca' ? 'Banca' : categoria === 'avaliadores' ? 'Avaliadores' : 'Público'}`}
                descricao={`
                    ${categoria === 'banca' ? 'Ranking das melhores apresentações por voto da banca avaliadora'
                        : categoria === 'avaliadores' ? 'Ranking dos melhores/maiores avaliadores da edição'
                            : categoria === 'publico' ? 'Ranking das melhores apresentações por voto da audiência'
                                : ''}
                    `}
                premiacoes={filteredAwards}
            />
        </div>
    );
}