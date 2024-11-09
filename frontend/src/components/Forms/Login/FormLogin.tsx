/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import usePost from "@/services/usePost";
import { useState } from "react";
import "./style.scss";

interface ILogin {
    email: string;
    password: string;
}

export function FormLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { cadastrarDados, error, sucesso } = usePost();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const usuario: ILogin = {
            email: email,
            password: password,
        };

        try {
            cadastrarDados({ url: "auth/login", dados: usuario });
        } catch (error) {
            error && alert("Não foi possível realizar o login!");
        }
    };

    return (
        <form className="row g-3" onSubmit={handleLogin}>
            <div className="col-12 mb-3">
                <label className="form-label">
                    E-mail
                    <span className="text-danger ms-1">*</span>
                </label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="exemplo@ufba.br"
                    required
                />
            </div>
            <div className="col-12 mb-3">
                <label className="form-label">
                    Senha
                    <span className="text-danger ms-1">*</span>
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="digite sua senha"
                    required
                />

                <div className="text-end">
                    <a href="/AlterarSenha" className="link-underline link-underline-opacity-0">
                        Esqueceu sua senha
                    </a>
                </div>
            </div>
            <div className="d-grid gap-2 col-3 mx-auto">
                <button type="submit" className="btn btn-primary">
                    Entrar
                </button>
            </div>
            <hr className="border border-warning border-2"></hr>
        </form>
    )
}