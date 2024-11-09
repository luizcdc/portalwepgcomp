"use client"

import { FormCadastro } from "@/components/Forms/Cadastro/FormCadastro";
import "./style.scss";

export default function Cadastro() {
    return (
        <div className="text-black">
            <div className="container">
                <h1 className="d-flex justify-content-center mt-5 fw-normal">WEPGCOMP
                    <span className="ms-2">2025</span>
                </h1>
                <hr />
                <h2 className="d-flex justify-content-center mb-4 fw-bold text-black">Cadastro</h2>
            </div>
            <div className="container d-flex justify-content-center mb-5">
                <FormCadastro />
            </div>
        </div>
    );
}