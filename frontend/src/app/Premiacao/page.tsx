"use client";

import Banner from "@/components/UI/Banner";

export default function Premiacao() {
    return (
        <div className="d-flex flex-column before-banner">
            <div className="d-flex flex-column">
                <Banner title="Premiação" />

                <div className="d-flex justify-content-center align-items-center">
                    <div className="d-flex flex-column content text-center">
                        <div className="d-grid g-3 text-black">
                            <p className="fw-bold">As premiações serão dadas por categoria:</p>
                            <ul className="list-unstyled">
                                <li className="mb-2">• Melhores apresentações por voto da audiência</li>
                                <li className="mb-2">• Melhores apresentações por voto da banca avaliadora</li>
                                <li className="mb-2">• Melhores avaliadores</li>
                            </ul>
                            <p className="fw-bold">O resultado será divulgado no último dia do evento.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
