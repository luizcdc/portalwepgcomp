import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./style.scss";

const formCadastroSchema = z.object({
  titulo: z.string({ invalid_type_error: "Campo Inválido" }).min(1, "O título/tema é obrigatório."),
  abstract: z.string({ invalid_type_error: "Campo Inválido" }).min(1, "O abstract é obrigatório"),
  orientador: z.string({ invalid_type_error: "Campo Inválido" }).min(1, "O nome do orientador é obrigatório."),
  coorientador: z.string().optional(),
  data: z.date().optional(),
  telefone: z
    .string()
    .regex(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos."),
  linkedin: z
    .string({ required_error: "O link do LinkedIn é obrigatório." })
    .url("Insira um link válido para o LinkedIn."),
  slide: z
    .custom<File>((value) => value instanceof FileList && value.length > 0, {
      message: "Arquivo obrigatório!",
    })
    .transform((value) => (value instanceof FileList ? value[0] : null))
    .refine((file) => file !== null, { message: "Arquivo obrigatório!" }),
});

type formCadastroSchema = z.infer<typeof formCadastroSchema>;

export function FormCadastroApresentacao() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formCadastroSchema>({
    resolver: zodResolver(formCadastroSchema),
  });

  const onSubmit = (data: formCadastroSchema) => {
    console.log("Dados enviados:", { ...data, data });
    alert("Cadastro realizado com sucesso!");
  };

  return (
    <form className="row g-3 cadastroApresentacao" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Tema da Pesquisa<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o título ou tema da pesquisa"
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Abstract<span className="text-danger ms-1">*</span>
        </label>
        <textarea
          className="form-control input-title"
          placeholder="Insira o resumo da pesquisa"
          {...register("abstract")}
        />
        <p className="text-danger error-message">{errors.abstract?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Nome do Orientador<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o nome do orientador"
          {...register("orientador")}
        />
        <p className="text-danger error-message">{errors.orientador?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Nome do Coorientador
        </label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o nome do coorientador"
          {...register("coorientador")}
        />
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Sugestão de Data
        </label>
        <input
          type="date"
          className="form-control input-title"
          placeholder="Insira a sugestão de uma data"
          {...register("data")}
        />
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Slide da Apresentação (PDF)<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="file"
          className="form-control input-title"
          accept=".pdf"
          {...register("slide")}
        />
        <p className="text-danger error-message">{errors.slide?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Telefone do Apresentador<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o número de telefone"
          {...register("telefone")}
        />
        <p className="text-danger error-message">{errors.telefone?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          LinkedIn<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="url"
          className="form-control input-title"
          placeholder="Insira o link do LinkedIn"
          {...register("linkedin")}
        />
        <p className="text-danger error-message">{errors.linkedin?.message}</p>
      </div>

      <br />
      <br />

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          data-bs-target="#apresentacaoModal"
          type="submit"
          data-bs-toggle="modal"
          className="btn text-white fs-5 fw-bold submit-button"
        >
          Cadastrar Apresentação
        </button>
      </div>
    </form>
  );
}
