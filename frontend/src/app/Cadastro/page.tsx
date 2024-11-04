"use client"

import { FormCadastro } from "@/components/Forms/FormCadastro";

export default function Cadastro() {
    return (
        <div style={{color: "black"}}>
            <div className="container" >
                <h1 className="d-flex justify-content-center mt-5 fw-normal text-primary">WEPGCOMP
                    <span className="fw-bold text-primary ms-2">2025</span>
                </h1>
                <hr className="border border-warning border-2"></hr>
                <h2 className="d-flex justify-content-center mb-4">Cadastro</h2>
            </div>
            <div className="container d-flex justify-content-center mb-5">
                <FormCadastro />
            </div>
        </div>
    );
}