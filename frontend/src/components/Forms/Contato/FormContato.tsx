import { sendContactRequest } from "@/services/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";
import { useSweetAlert } from '@/hooks/useAlert';

const formContatoSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .regex(/^[a-zA-ZÀ-ÿ]+$/, {
      message: "Preenchimento obrigatório",
    }),

  email: z
    .string({
      required_error: "E-mail é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .email({
      message: "E-mail inválido!",
    }),

  text: z
    .string({
      required_error: "A mensagem é obrigatória!",
      invalid_type_error: "Campo inválido!",
    })
    .min(1, { message: "A mensagem não pode ser vazia!" }),
});

export function FormContato() {
  type FormContatoSchema = z.infer<typeof formContatoSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormContatoSchema>({
    resolver: zodResolver(formContatoSchema),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  
  const { showAlert } = useSweetAlert();

  const handleFormContato = async (data: FormContatoSchema) => {
    try {
      await sendContactRequest(data);
      showAlert({
        icon: "success",
        title: "Mensagem enviada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      showAlert({
        icon: "error",
        title: "Erro ao enviar mensagem",
        text: "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        confirmButtonText: "Retornar",
      });
    }
  };

  return (
    <form
      className="justify-content-center form-contato"
      onSubmit={handleSubmit(handleFormContato)}
    >
      <div className="row mb-3">
        <div className="col-12 col-sm-6">
          <label className="form-label fs-5 text-white fw-semibold">Nome:</label>
          <input
            type="nome"
            className="form-control input-title bg-transparent border-1 text-white shadow-none"
            placeholder="Insira seu nome"
            {...register("name")}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <p className="text-warning error-message">{errors.name?.message}</p>
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label fs-5 text-white fw-semibold">E-mail:</label>
          <input
            type="email"
            className="form-control input-title bg-transparent border-1 text-white shadow-none"
            placeholder="Insira seu e-mail"
            {...register("email")}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <p className="text-warning error-message">{errors.email?.message}</p>
        </div>
      </div>

      <div>
        <label className="form-label fs-5 text-white fw-semibold">Mensagem:</label>
        <textarea
          className="form-control input-title bg-transparent border-1 border-white text-white shadow-none"
          placeholder="Digite sua mensagem"
          rows={5}
          {...register("text")}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <p className="text-warning error-message">{errors.text?.message}</p>
      </div>

      <div className="d-flex justify-content-center mt-4 mb-4 bg-white border border-white rounded-3">
        <button type="submit" className="btn fw-bold">
          Enviar
        </button>
      </div>
    </form>
  );
}
