"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";

import { zodResolver } from "@hookform/resolvers/zod";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { z } from "zod";

import "./style.scss";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { useEdicao } from "@/hooks/useEdicao";

const formSessaoOrdenarApresentacoesSchema = z.object({
  apresentacao1: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Apresentação 1 é obrigatória!"),

  apresentacao2: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Apresentação 2 é obrigatória!"),
});

export default function FormSessaoOrdenarApresentacoes() {
  const [apresentacao1Value, setApresentacao1Value] = useState<string>("");
  const { confirmButton } = ModalSessaoMock;

  const { swapPresentationsOnSession, sessao } = useSession();
  const { Edicao } = useEdicao();

  type FormSessaoOrdenarApresentacoesSchema = z.infer<
    typeof formSessaoOrdenarApresentacoesSchema
  >;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormSessaoOrdenarApresentacoesSchema>({
    resolver: zodResolver(formSessaoOrdenarApresentacoesSchema),
  });

  const apresentacoesOptions = sessao?.presentations?.map((v) => {
    return {
      value: v.id,
      label: v.submission?.title || "",
    };
  });

  const handleFormSessaoApresentacoes = (
    data: FormSessaoOrdenarApresentacoesSchema
  ) => {
    if (!data.apresentacao1 || !data.apresentacao2) {
      throw new Error("Uma dos campos está vazio");
    }

    swapPresentationsOnSession(sessao?.id || "", Edicao?.id ?? "", {
      presentation1Id: data.apresentacao1,
      presentation2Id: data.apresentacao2,
    }).then((status) => (status ? reset() : undefined));
  };

  useEffect(() => {
    if (watch("apresentacao1") !== apresentacao1Value) {
      resetField("apresentacao2");
      setApresentacao1Value(watch("apresentacao1"));
    }
  }, [watch("apresentacao1")]);

  return (
    <form
      className="row g-3 form-sessao"
      onSubmit={handleSubmit(handleFormSessaoApresentacoes)}
    >
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Selecione uma apresentação
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <select
          id="apresentacao1-id"
          className="form-select"
          {...register("apresentacao1")}
        >
          <option value="" hidden>
            Selecione uma apresentação
          </option>
          {apresentacoesOptions?.map((op, i) => (
            <option id={`apres1-op${i}`} key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        <p className="text-danger error-message">
          {errors.apresentacao1?.message}
        </p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Selecione outra apresentação
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <select
          id="apresentacao2-id"
          className="form-select"
          disabled={!watch("apresentacao1")}
          {...register("apresentacao2")}
        >
          <option value="" hidden>
            Selecione outra apresentação
          </option>
          {apresentacoesOptions
            ?.filter((v) => v.value !== watch("apresentacao1"))
            ?.map((op, i) => (
              <option id={`apres2-op${i}`} key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
        </select>

        <p className="text-danger error-message">
          {errors.apresentacao2?.message}
        </p>
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="submit"
          id="sa-submit-button"
          className="btn btn-primary button-modal-component button-sessao-geral"
        >
          {confirmButton.label}
        </button>
      </div>
    </form>
  );
}
