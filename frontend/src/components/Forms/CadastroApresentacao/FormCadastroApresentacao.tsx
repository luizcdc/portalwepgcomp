"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UUID } from "crypto";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { SubmissionContext } from "@/context/submission";
import { useSweetAlert } from "@/hooks/useAlert";
import "./style.scss";

const formCadastroSchema = z.object({
  titulo: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O título é obrigatório."),
  abstract: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O abstract é obrigatório"),
  orientador: z
    .string({ invalid_type_error: "Campo Inválido" })
    .uuid(),
  coorientador: z.string().optional(),
  data: z.string().optional(),
  celular: z
    .string()
    .regex(/^\d{10,11}$/, "O celular deve conter 10 ou 11 dígitos."),
  slide: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "Arquivo é obrigatório"),
});

type formCadastroSchema = z.infer<typeof formCadastroSchema>;

export function FormCadastroApresentacao() {
  const pathname = usePathname();
  const { showAlert } = useSweetAlert();
  const { user } = useContext(AuthContext);
  const { createSubmission } = useContext(SubmissionContext);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<formCadastroSchema>({
    resolver: zodResolver(formCadastroSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) setValue("slide", file.name);
  }


  const onSubmit = (data: formCadastroSchema) => {
    if (!user) {
      showAlert({
        icon: "error",
        text:
          "Você precisa estar logado para realizar a submissão.",
        confirmButtonText: "Retornar",
      });

      return;
    }

    const submissionData = {
      mainAuthorId: user.id,
      title: data.titulo,
      abstractText: data.abstract,
      advisorId: data.orientador as UUID,
      coAdvisor: data.coorientador || "",
      dateSuggestion: data.data ? new Date(data.data) : undefined,
      pdfFile: data.slide,
      phoneNumber: data.celular,
    };

    createSubmission(submissionData);
  };

  return (
    <form
      className='row cadastroApresentacao'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Título da pesquisa<span className='text-danger ms-1'>*</span>
        </label>
        <input
          type='text'
          className='form-control input-title'
          placeholder='Insira o título da pesquisa'
          {...register("titulo")}
        />
        <p className='text-danger error-message'>{errors.titulo?.message}</p>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Abstract<span className='text-danger ms-1'>*</span>
        </label>
        <textarea
          className='form-control input-title'
          placeholder='Insira o resumo da pesquisa'
          {...register("abstract")}
        />
        <p className='text-danger error-message'>{errors.abstract?.message}</p>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Nome do orientador<span className='text-danger ms-1'>*</span>
        </label>
        <select
          id="orientador-select"
          className="form-control input-title"
          {...register("orientador")}
        >
          <option value="">Selecione o nome do orientador</option>
          <option value="8b5436b3-192b-46c4-8e8e-3a81ec7e2428">Fred Durão</option>
        </select>
        <p className='text-danger error-message'>
          {errors.orientador?.message}
        </p>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>Nome do coorientador</label>
        <input
          type='text'
          className='form-control input-title'
          placeholder='Insira o nome do coorientador'
          {...register("coorientador")}
        />
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>Sugestão de data</label>

        <div className="input-group listagem-template-content-input">
          <Controller
            control={control}
            name="data"
            render={({ field }) => (
              <DatePicker
                id="sa-inicio-data"
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                selected={field.value ? new Date(field.value) : null}
                className="form-control datepicker"
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText={'Insira a sugestão de uma data para a apresentação'}
              />
            )}
          />
        </div>
      </div>

      <div className='col-12 mb-1'>
        <label className='form-label form-title'>
          Slide da apresentação <span className="txt-min">(PDF)</span><span className='text-danger ms-1'>*</span>
        </label>
        <input
          type='file'
          className='form-control input-title'
          accept='.pdf'
          onChange={handleFileChange}
        />
        <p className='text-danger error-message'>{errors.slide?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Celular <span className="txt-min">(preferência WhatsApp)</span><span className="text-danger ms-1">*</span>
        </label>
        <input
          className="form-control input-title"
          placeholder="(XX) XXXXX-XXXX"
          {...register("celular")}
        />
        <p className="text-danger error-message">{errors.celular?.message}</p>
      </div>

      <br />
      <br />

      <div className='d-grid gap-2 col-3 mx-auto'>
        <button
          data-bs-target='#collapse'
          type='submit'
          data-bs-toggle="collapse"
          className='btn text-white fs-5 submit-button'
        >
          {pathname.includes("Cadastro") ? "Cadastrar" : "Alterar"}
        </button>
      </div>
    </form>
  );
}
