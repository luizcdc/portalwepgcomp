"use client"

import { FormCadastro } from "@/components/Forms/FormCadastro";

export default function Cadastro() {
    return (
        <div style={{ color: "black" }}>
            <div className="container" >
                <h1 className="d-flex justify-content-center mt-5 fw-normal" style={{ fontSize: "3rem", color: "#0066BA" }}>WEPGCOMP
                    <span className="ms-2" style={{ fontSize: "3rem", color: "#0066BA" }}>2025</span>
                </h1>
                <hr style={{ border: "2px solid #FFA90F" }}></hr>
                <h2 className="d-flex justify-content-center mb-4 fw-bold text-black" style={{ fontSize: "3rem" }}>Cadastro</h2>
            </div>
            <div className="container d-flex justify-content-center mb-5">
                <FormCadastro />
            </div>
        </div>
    );
}