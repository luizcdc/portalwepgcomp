import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formCadastroSchema = z.object({
    nome: z.string({
        required_error: 'Nome é obrigatório!'
    }),
    matricula: z.number().min(10).max(10),
    email: z.string({
        required_error: 'E-mail é obrigatório!'
    }).email({
        message: 'E-mail inválido!'
    }),
    perfil: z.string({
        required_error: 'A escolha do perfil é obrigatória!'
    }),
    senha: z.string(),
    confirmaSenha: z.string(),
}).refine((data) => data.senha === data.confirmaSenha, {
    message: 'As senhas não conferem!',
    path: ["confirma"],
})

export function FormCadastro() {
    const { register, handleSubmit } = useForm<FormCadastroSchema>({
        resolver: zodResolver(formCadastroSchema)
    })

    type FormCadastroSchema = z.infer<typeof formCadastroSchema>

    const handleFormCadastro = (data: FormCadastroSchema) => {
        console.log(data);
    }


    return (
        <form className="row g-3" onSubmit={handleSubmit(handleFormCadastro)}>
            <div className="col-12 mb-3">
                <label className="form-label">Nome completo
                    <span className="text-danger ms-1">*</span>
                </label>
                <input type="text" className="form-control" id="nome" placeholder="Insira seu nome" {...register('nome')} required />
            </div>
            <div className="col-12 mb-3">
                <label className="form-label">
                    Matrícula
                    <span className="text-danger ms-1">*</span>
                </label>
                <input type="number" className="form-control" id="matricula"
                    placeholder="Insira sua matrícula" {...register('matricula')} required />
            </div>
            <div className="col-12 mb-3">
                <label className="form-label">E-mail UFBA
                    <span className="text-danger ms-1">*</span>
                </label>
                <input type="email" className="form-control" id="email" placeholder="Insira seu e-mail" {...register('email')} required />
            </div>
            <div className="col-12 mb-3">
                <label className="form-label">Perfil
                    <span className="text-danger ms-1">*</span>
                </label>
                <div className="d-flex">
                    <div className="form-check me-3">
                        <input type="radio" className="form-check-input" id="radio1" name="perfil" value="professor" defaultChecked required />
                        <label className="form-check-label" htmlFor="radio1">
                            Professor
                        </label>
                    </div>
                    <div className="form-check">
                        <input type="radio" className="form-check-input" id="radio2" name="perfil" value="aluno" required />
                        <label className="form-check-label" htmlFor="radio2">
                            Aluno
                        </label>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-3">
                <label className="form-label">Senha
                    <span className="text-danger ms-1">*</span>
                </label>
                <input type="password" className="form-control" id="senha" placeholder="Insira sua senha" required />
                <div className="mt-3">
                    <p className="mb-1">A senha deve possuir pelo menos:</p>
                    <ul className="mb-0">
                        <li>8 dígitos</li>
                        <li>1 letra maiúscula</li>
                        <li>1 letra minúscula</li>
                        <li>4 números</li>
                        <li>1 caracter especial</li>
                    </ul>
                </div>
            </div>
            <div className="col-12 mb-5">
                <label className="form-label">Confirmação de senha
                    <span className="text-danger ms-1">*</span>
                </label>
                <input type="password" className="form-control" id="confirmaSenha" placeholder="Insira sua senha novamente" required />
            </div>
            <div className="d-grid gap-2 col-3 mx-auto">
                <button type="submit" className="btn btn-warning text-white fs-5 fw-bold">Enviar</button>
            </div>
            <p className="text-end">Já tem uma conta? <a href="#" className="link-underline link-underline-opacity-0">Login</a></p>
        </form>
    )
}