"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { SubmissionContext } from "@/context/submission";
import { UserContext } from "@/context/user";
import { useSweetAlert } from "@/hooks/useAlert";
import { useSubmissionFile } from "@/hooks/useSubmissionFile";

import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";

const formCadastroSchema = z.object({
  id: z.string().optional(),
  titulo: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O título é obrigatório"),
  abstract: z
    .string({ invalid_type_error: "Campo Inválido" })
    .min(1, "O abstract é obrigatório"),
  doutorando: z.string({ invalid_type_error: "Campo Inválido" }).optional(),
  orientador: z
    .string({ invalid_type_error: "Campo Inválido" })
    .uuid({ message: "O orientador é obrigatório" }),
  coorientador: z.string().optional(),
  data: z.string().optional(),
  celular: z
    .string()
    .regex(/^\d{10,11}$/, "O celular deve conter 10 ou 11 dígitos"),
  slide: z.string({ invalid_type_error: "Campo Inválido" }).optional(), //temporário para a entrega,
});

type formCadastroSchema = z.infer<typeof formCadastroSchema>;

export function FormCadastroApresentacao() {
  const router = useRouter();
  const { showAlert } = useSweetAlert();
  const { user } = useContext(AuthContext);
  const { createSubmission, updateSubmissionById, submission, setSubmission } =
    useContext(SubmissionContext);
  const { getAdvisors, advisors, getUsers, userList, loadingUserList } =
    useContext(UserContext);
  const { sendFile } = useSubmissionFile();
  const [advisorsLoaded, setAdvisorsLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { Edicao } = useEdicao();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<formCadastroSchema>({
    resolver: zodResolver(formCadastroSchema),
  });

  useEffect(() => {
    if (submission && Object.keys(submission).length) {
      setValue("id", submission.id);
      setValue("titulo", submission?.title);
      setValue("abstract", submission?.abstract ?? "");
      setValue("doutorando", submission?.mainAuthorId);
      setValue("orientador", submission?.advisorId);
      setValue("coorientador", submission?.coAdvisor);
      setValue("slide", submission?.pdfFile);
      setFileName(submission?.pdfFile);
      setValue("celular", submission?.phoneNumber);
    } else {
      setValue("id", "");
      setValue("titulo", "");
      setValue("abstract", "");
      setValue("doutorando", "");
      setValue("orientador", "");
      setValue("coorientador", "");
      setValue("data", "");
      setValue("slide", "");
      setValue("celular", "");

      setFile(null);
      setFileName(null);
    }
  }, [submission, setValue]);

  useEffect(() => {
    if (!advisorsLoaded) {
      getAdvisors();
      setAdvisorsLoaded(true);
    }
  }, [advisorsLoaded, getAdvisors]);

  useEffect(() => {
    if (user?.level !== "Default" && userList.length === 0) {
      getUsers({ profiles: "DoctoralStudent" });
    }
  }, [user?.level, userList.length, getUsers]);

  const doctoralStudents = userList.filter(
    (user) => user.profile === "DoctoralStudent"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setValue("slide", selectedFile.name);
    }
  };

  const onSubmit = async (data: formCadastroSchema) => {
    if (!user) {
      showAlert({
        icon: "error",
        text: "Você precisa estar logado para realizar a submissão.",
        confirmButtonText: "Retornar",
      });

      return;
    }

    if (file) {
      const response = await sendFile(file, user.id);

      if (response?.key) {
        const submissionData = {
          ...submission,
          eventEditionId: getEventEditionIdStorage() ?? "",
          mainAuthorId: data.doutorando || user.id,
          title: data.titulo,
          abstractText: data.abstract,
          advisorId: data.orientador as UUID,
          coAdvisor: data.coorientador || "",
          dateSuggestion: data.data ? new Date(data.data) : undefined,
          pdfFile: response?.key ?? file.name,
          phoneNumber: data.celular,
        };

        if (submission && submission?.id) {
          updateSubmissionById(submission.id, submissionData).then((status) => {
            if (status) {
              reset();
              setSubmission(null);
            }
          });
        } else {
          createSubmission(submissionData).then((status) => {
            if (status) {
              reset();
              setSubmission(null);

              if (user?.profile == "DoctoralStudent") {
                router.push("/minha-apresentacao");
              }
            }
          });
        }
      }
    } else {
      const submissionData = {
        ...submission,
        eventEditionId: getEventEditionIdStorage() ?? "",
        mainAuthorId: data.doutorando || user.id,
        title: data.titulo,
        abstractText: data.abstract,
        advisorId: data.orientador as UUID,
        coAdvisor: data.coorientador || "",
        dateSuggestion: data.data ? new Date(data.data) : undefined,
        pdfFile: data.slide ?? "",
        phoneNumber: data.celular,
      };

      if (submission && submission?.id) {
        updateSubmissionById(submission.id, submissionData).then((status) => {
          if (status) {
            reset();
            setSubmission(null);
          }
        });
      }
    }
  };
  const onInvalid = (errors) => console.error(errors);

  const modalTitle =
    submission && submission.id
      ? "Editar Apresentação"
      : "Cadastrar Apresentação";

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form
      className="row cadastroApresentacao"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <div className="modal-title">
        <h3 className="d-flex fw-bold text-center justify-content-center mb-4">
          {modalTitle}
        </h3>
      </div>

      {user?.level !== "Default" && (
        <div className="col-12 mb-1">
          <label className="form-label form-title">
            Selecionar doutorando
            <span className="text-danger ms-1">*</span>
          </label>
          <select
            id="doutorando-select"
            className="form-control input-title"
            {...register("doutorando")}
            disabled={loadingUserList}
          >
            <option value="">Selecione um doutorando</option>
            {doctoralStudents.length === 0 && !loadingUserList ? (
              <option value="" disabled>
                Nenhum doutorando encontrado
              </option>
            ) : (
              doctoralStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Título da pesquisa<span className="text-danger ms-1">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o título da pesquisa"
          {...register("titulo")}
        />
        <p className="text-danger error-message">{errors.titulo?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Abstract<span className="text-danger ms-1">*</span>
        </label>
        <textarea
          className="form-control input-title overflow-y-hidden"
          placeholder="Insira o resumo da pesquisa"
          {...register("abstract")}
          onInput={handleTextareaChange}
        />
        <p className="text-danger error-message">{errors.abstract?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Nome do orientador<span className="text-danger ms-1">*</span>
        </label>
        <select
          id="orientador-select"
          className="form-control input-title"
          {...register("orientador")}
        >
          <option value="">Selecione o nome do orientador</option>
          {advisors.map((advisor) => (
            <option key={advisor.id} value={advisor.id}>
              {advisor.name}
            </option>
          ))}
        </select>
        <p className="text-danger error-message">
          {errors.orientador?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">Nome do coorientador</label>
        <input
          type="text"
          className="form-control input-title"
          placeholder="Insira o nome do coorientador"
          {...register("coorientador")}
        />
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Slide da apresentação <span className="txt-min">(PDF)</span>
          <span className="text-danger ms-1">*</span>
        </label>

        <input
          type="file"
          className="form-control input-title"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {fileName && (
          <p className="file-name">Arquivo selecionado: {fileName}</p>
        )}

        <p className="text-danger error-message">{errors.slide?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label form-title">
          Celular <span className="txt-min">(preferência WhatsApp)</span>
          <span className="text-danger ms-1">*</span>
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

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          data-bs-target="#collapse"
          type="submit"
          data-bs-toggle="collapse"
          className="btn text-white fs-5 submit-button"
          disabled={!Edicao?.isActive}
        >
          {submission && submission?.id ? "Alterar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
