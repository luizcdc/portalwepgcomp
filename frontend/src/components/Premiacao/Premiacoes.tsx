import Image from 'next/image';
import { useEffect, useState } from 'react';

import { premiacoesAvaliadoresMock, premiacoesBancaMock, premiacoesPublicoMock } from '@/mocks/Premiacao';
import PremiacaoCategoria from './PremiacaoCategoria';

import "./style.scss";
import { useEdicao } from '@/hooks/useEdicao';
import { usePremiacao } from '@/hooks/usePremiacao';

export default function Premiacoes({ categoria }: { categoria: "banca" | "avaliadores" | "publico" }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { listEdicao, Edicao } = useEdicao();

    const { 
        premiacaoListBanca,
        premiacaoListAudiencia,
        premiacaoListAvaliadores,
        getPremiacoesBanca,
        getPremiacoesAudiencia,
        getPremiacoesAvaliadores
    } = usePremiacao();
    
    useEffect(() => {
        listEdicao();
        if(Edicao) {
            switch (categoria) {
                case "banca":
                    getPremiacoesBanca(Edicao.id);
                case "publico":
                    getPremiacoesAudiencia(Edicao.id);
                case "avaliadores":
                    getPremiacoesAvaliadores(Edicao.id);
            }
        }
    }, [Edicao?.id]);

    const getAwards = () => {
        switch (categoria) {
            case "banca":
                return premiacoesBancaMock;
            case "publico":
                return premiacoesPublicoMock;
            default:
                return [];
        }
    };

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
                categoria={categoria}
                premiacoes={premiacaoListBanca}
                avaliadores={premiacaoListAvaliadores}
            />
        </div>
    );
}