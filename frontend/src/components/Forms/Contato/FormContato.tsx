import { sendContactRequest } from "@/services/contact";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";
import { useSweetAlert } from "@/hooks/useAlert";

const formContatoSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .min(1, { message: "Nome é obrigatório!" }),

  email: z
    .string({
      required_error: "E-mail é obrigatório!",
      invalid_type_error: "Campo inválido!",
    })
    .min(1, { message: "E-mail é obrigatório!" })
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
    reset,
    formState: { errors },
  } = useForm<FormContatoSchema>({
    resolver: zodResolver(formContatoSchema),
  });

  const { showAlert } = useSweetAlert();

  const handleFormContato = async (data: FormContatoSchema) => {
    sendContactRequest(data)
      .then((resp) => {
        if (resp.status < 200 || resp.status >= 300) {
          showAlert({
            icon: "error",
            title: "Erro ao enviar mensagem",
            text:
              resp?.response?.data?.message?.message ||
              resp?.response?.data?.message ||
              "Ocorreu um erro ao enviar o formulário. Tente novamente.",
            confirmButtonText: "Retornar",
          });
        } else {
          showAlert({
            icon: "success",
            title: "Mensagem enviada com sucesso!",
            timer: 3000,
            showConfirmButton: false,
          });
          reset();
        }
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao enviar mensagem",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro ao enviar o formulário. Tente novamente.",
          confirmButtonText: "Retornar",
        });
      });
  };

  return (
    <form
      className="justify-content-center form-contato"
      onSubmit={handleSubmit(handleFormContato)}
    >
      <div className="row mb-3">
        <div className="col-12 col-sm-6">
          <label className="form-label fs-5 text-white fw-semibold">
            Nome:
          </label>
          <input
            type="nome"
            className="form-control input-title bg-transparent border-1 text-white shadow-none"
            placeholder="Insira seu nome"
            {...register("name")}
          />
          <p className="text-warning error-message">{errors.name?.message}</p>
        </div>

        <div className="col-12 col-sm-6">
          <label className="form-label fs-5 text-white fw-semibold">
            E-mail:
          </label>
          <input
            type="email"
            className="form-control input-title bg-transparent border-1 text-white shadow-none"
            placeholder="Insira seu e-mail"
            {...register("email")}
          />
          <p className="text-warning error-message">{errors.email?.message}</p>
        </div>
      </div>

      <div>
        <label className="form-label fs-5 text-white fw-semibold">
          Mensagem:
        </label>
        <textarea
          className="form-control input-title bg-transparent border-1 border-white text-white shadow-none"
          placeholder="Digite sua mensagem"
          rows={5}
          {...register("text")}
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
