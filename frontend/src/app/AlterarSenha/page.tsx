"use client"

import { FormAlterarSenha } from "@/components/Forms/AlterarSenha/FormAlterarSenha";
import "./style.scss";

export default function AlterarSenha() {
    return (
        <div className="text-black">
            <div className="container">
                <h1 className="d-flex justify-content-center mt-5 fw-normal">WEPGCOMP
                    <span className="ms-2">2025</span>
                </h1>
                <hr />
                <h2 className="d-flex justify-content-center mb-4 fw-bold text-black">Alteração de Senha</h2>
            </div>
            <div className="container d-flex justify-content-center mb-5">
                <FormAlterarSenha />
            </div>
        </div>
    );
}