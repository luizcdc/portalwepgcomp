"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "react-datepicker/dist/react-datepicker.css";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useEdicao } from "@/hooks/useEdicao";

import "./style.scss";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useEffect } from "react";

const formCriteriosSchema = z.object({
  criterio1titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título do critério 1 é obrigatório!"),

  criterio2titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título do critério 2 é obrigatório!"),

  criterio3titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título do critério 3 é obrigatório!"),

  criterio4titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título do critério 4 é obrigatório!"),

  criterio5titulo: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Título do critério 5 é obrigatório!"),

  criterio1: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Descrição do critério 1 é obrigatório!"),

  criterio2: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Descrição do critério 2 é obrigatório!"),

  criterio3: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Descrição do critério 3 é obrigatório!"),

  criterio4: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Descrição do critério 4 é obrigatório!"),

  criterio5: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Descrição do critério 5 é obrigatório!"),
});

export default function FormCriterios() {
  const { Edicao } = useEdicao();
  const {
    createEvaluationCriteria,
    updateEvaluationCriteria,
    evaluationCriteria,
    getEvaluationCriteria,
  } = useEvaluation();

  type FormCriteriosSchema = z.infer<typeof formCriteriosSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormCriteriosSchema>({
    resolver: zodResolver(formCriteriosSchema),
  });

  const eventEditionId = getEventEditionIdStorage() ?? "";

  const handleFormCriterios = (data: FormCriteriosSchema) => {
    const criteriaOfEdition = evaluationCriteria?.filter(
      (v) => v.eventEditionId === eventEditionId
    );

    if (
      !data.criterio1 ||
      !data.criterio2 ||
      !data.criterio3 ||
      !data.criterio4 ||
      !data.criterio5 ||
      !data.criterio1titulo ||
      !data.criterio2titulo ||
      !data.criterio3titulo ||
      !data.criterio4titulo ||
      !data.criterio5titulo
    ) {
      throw new Error("Um dos campos está vazio");
    }

    const criterios = criteriaOfEdition?.length
      ? criteriaOfEdition?.map((value, i) => ({
          id: value.id,
          title: data[`criterio${i + 1}titulo`],
          description: data[`criterio${i + 1}`],
        }))
      : [
          { title: data.criterio1titulo, description: data.criterio1 },
          { title: data.criterio2titulo, description: data.criterio2 },
          { title: data.criterio3titulo, description: data.criterio3 },
          { title: data.criterio4titulo, description: data.criterio4 },
          { title: data.criterio5titulo, description: data.criterio5 },
        ];

    const body: EvaluationCriteriaParams[] = criterios?.map((criteria) => ({
      id: criteria?.id || undefined,
      eventEditionId,
      title: criteria.title,
      description: criteria.description,
      weightRadio: null,
    }));

    if (criteriaOfEdition?.length) {
      updateEvaluationCriteria(body).then((status) => {
        if (status) {
          reset();
          getEvaluationCriteria(eventEditionId);
        }
      });

      return;
    }

    createEvaluationCriteria(body).then((status) => {
      if (status) {
        reset();
        getEvaluationCriteria(eventEditionId);
      }
    });
  };

  useEffect(() => {
    const defaultCriteria = [
      {
        title: "Conteúdo",
        description:
          "Quão satisfeito(a) você ficou com o conteúdo da pesquisa apresentada?",
      },
      {
        title: "Qualidade e clareza",
        description:
          "Quão satisfeito(a) você ficou com a qualidade e clareza da apresentação?",
      },
      {
        title: "Relevância ao tema",
        description:
          "Quão bem a pesquisa abordou e explicou o problema central?",
      },
      {
        title: "Solução proposta",
        description:
          "Quão clara e prática você considera a solução proposta pela pesquisa?",
      },
      {
        title: "Resultados",
        description:
          "Como você avalia a qualidade e aplicabilidade dos resultados apresentados?",
      },
    ];

    defaultCriteria?.map((criteria, i) => {
      setValue(`criterio${i + 1}titulo` as any, criteria.title);
      setValue(`criterio${i + 1}` as any, criteria.description);
    });

    getEvaluationCriteria(eventEditionId);
  }, [eventEditionId]);

  useEffect(() => {
    if (evaluationCriteria.length) {
      evaluationCriteria?.map((criteria, i) => {
        setValue(`criterio${i + 1}titulo` as any, criteria.title ?? "");
        setValue(`criterio${i + 1}` as any, criteria.description ?? "");
      });
    }
  }, [evaluationCriteria]);

  return (
    <form
      className="row g-3 form-criterios"
      onSubmit={handleSubmit(handleFormCriterios)}
    >
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o tema do critério 1:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o tema do critério"}
          {...register("criterio1titulo")}
        />
        <p className="text-danger error-message">
          {errors.criterio1titulo?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o critério 1:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o critério"}
          {...register("criterio1")}
        />
        <p className="text-danger error-message">{errors.criterio1?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o tema do critério 2:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o tema do critério"}
          {...register("criterio2titulo")}
        />
        <p className="text-danger error-message">
          {errors.criterio2titulo?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o critério 2:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o critério"}
          {...register("criterio2")}
        />
        <p className="text-danger error-message">{errors.criterio2?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o tema do critério 3:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o tema do critério"}
          {...register("criterio3titulo")}
        />
        <p className="text-danger error-message">
          {errors.criterio3titulo?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o critério 3:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o critério"}
          {...register("criterio3")}
        />
        <p className="text-danger error-message">{errors.criterio3?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o tema do critério 4:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o tema do critério"}
          {...register("criterio4titulo")}
        />
        <p className="text-danger error-message">
          {errors.criterio4titulo?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o critério 4:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o critério"}
          {...register("criterio4")}
        />
        <p className="text-danger error-message">{errors.criterio4?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o tema do critério 5:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o tema do critério"}
          {...register("criterio5titulo")}
        />
        <p className="text-danger error-message">
          {errors.criterio5titulo?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title ">
          Digite o critério 5:
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="sg-titulo-input"
          placeholder={"Digite o critério"}
          {...register("criterio5")}
        />
        <p className="text-danger error-message">{errors.criterio5?.message}</p>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="submit"
          id="sa-submit-button"
          className="btn btn-primary button-modal-component button-criterios"
          disabled={!Edicao?.isActive}
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
