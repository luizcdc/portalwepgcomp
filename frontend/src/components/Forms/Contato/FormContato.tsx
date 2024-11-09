import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";

const formContatoSchema = z.object({
    nome: z
        .string({
            required_error: "Nome é obrigatório!",
            invalid_type_error: "Campo inválido!",
        })
        .regex(/^[a-zA-ZÀ-ÿ]+$/, {
            message: "O campo deve conter apenas letras.",
        }),

    email: z
        .string({
            required_error: "E-mail é obrigatório!",
            invalid_type_error: "Campo inválido!",
        })
        .email({
            message: "E-mail inválido!",
        }),

    mensagem: z.string({
        required_error: "A mensagem é obrigatória!",
        invalid_type_error: "Campo inválido!",
    }).min(1, { message: "A mensagem não pode ser vazia!" })
})

export function FormContato() {
    type FormContatoSchema = z.infer<typeof formContatoSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormContatoSchema>({
        resolver: zodResolver(formContatoSchema)
    });

    const handleFormContato = (data: FormContatoSchema) => {
        console.log(data);
    };

    return (
        <form className="justify-content-center" onSubmit={handleSubmit(handleFormContato)}>
            <div className="row mb-3">
                <div className="col-6">
                    <label className='form-label form-title fw-semibold'>
                        Nome:
                    </label>
                    <input
                        type='nome'
                        className='form-control input-title bg-transparent border-1 text-white shadow-none'
                        id='name'
                        placeholder='Insira seu nome'
                        {...register("nome")}
                    />
                    <p className="text-warning error-message">{errors.nome?.message}</p>
                </div>

                <div className="col-6">
                    <label className='form-label form-title fw-semibold'>
                        E-mail:
                    </label>
                    <input
                        type='email'
                        className='form-control input-title bg-transparent border-1 text-white shadow-none'
                        id='email'
                        placeholder='Insira seu e-mail'
                        {...register("email")}
                    />
                    <p className="text-warning error-message">{errors.email?.message}</p>
                </div>
            </div>

            <div>
                <label className='form-label form-title fw-semibold'>
                    Mensagem:
                </label>
                <textarea
                    className='form-control input-title bg-transparent border-1 border-white text-white shadow-none'
                    id='message'
                    placeholder='Digite sua mensagem'
                    rows="5"
                    {...register("mensagem")}
                />
                <p className="text-warning error-message">{errors.mensagem?.message}</p>
            </div>

            <div className="d-flex justify-content-center mt-4 mb-4 bg-white border border-white rounded-3">
                <button
                    type="submit"
                    className="btn fw-bold"
                >
                    Enviar
                </button>
            </div>
        </form>
    )
}