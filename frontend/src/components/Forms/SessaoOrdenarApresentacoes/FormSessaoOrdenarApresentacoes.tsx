"use client";

import { ModalSessaoMock } from "@/mocks/ModalSessoes";

import { zodResolver } from "@hookform/resolvers/zod";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { z } from "zod";

import "./style.scss";
import { formatOptions } from "@/utils/formatOptions";

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
  const { confirmButton } = ModalSessaoMock;

  type FormSessaoOrdenarApresentacoesSchema = z.infer<
    typeof formSessaoOrdenarApresentacoesSchema
  >;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSessaoOrdenarApresentacoesSchema>({
    resolver: zodResolver(formSessaoOrdenarApresentacoesSchema),
  });

  const presentationsMock = [
    {
      id: "529ac0f5-da94-4d73-bc53-8ef255c714cc",
      submissionId: "d71c3dd6-a433-4d5a-961f-e931f4165074",
      presentationBlockId: "290891e7-df2a-40d0-9882-2c2c6cce968c",
      positionWithinBlock: 1,
      status: "ToPresent",
      startTime: "2024-05-01T12:20:00.000Z",
      createdAt: "2024-12-11T22:17:55.443Z",
      updatedAt: "2024-12-11T22:17:55.443Z",
      title: "The Impact of AI in Modern Research",
      submission: {
        id: "d71c3dd6-a433-4d5a-961f-e931f4165074",
        advisorId: "980f9547-7406-4f80-9640-b52809b260bf",
        mainAuthorId: "980f9547-7406-4f80-9640-b52809b260bf",
        eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
        abstract: "A study on how AI impacts modern research methodologies.",
        pdfFile: "path/to/document.pdf",
        phoneNumber: "123-456-7890",
        proposedPresentationBlockId: null,
        proposedPositionWithinBlock: null,
        coAdvisor: null,
        status: "Submitted",
        createdAt: "2024-12-11T22:17:50.792Z",
        updatedAt: "2024-12-11T22:17:50.792Z",
      },
    },
    {
      id: "529ac0f5-da94-4d73-bc53-8ef255c714cd",
      submissionId: "d71c3dd6-a433-4d5a-961f-e931f4165074",
      presentationBlockId: "290891e7-df2a-40d0-9882-2c2c6cce968c",
      positionWithinBlock: 2,
      status: "ToPresent",
      startTime: "2024-05-01T12:20:00.000Z",
      createdAt: "2024-12-11T22:17:55.443Z",
      updatedAt: "2024-12-11T22:17:55.443Z",
      title: "The Impact of AI in Modern Research 2",
      submission: {
        id: "d71c3dd6-a433-4d5a-961f-e931f4165074",
        advisorId: "980f9547-7406-4f80-9640-b52809b260bf",
        mainAuthorId: "980f9547-7406-4f80-9640-b52809b260bf",
        eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
        abstract: "A study on how AI impacts modern research methodologies.",
        pdfFile: "path/to/document.pdf",
        phoneNumber: "123-456-7890",
        proposedPresentationBlockId: null,
        proposedPositionWithinBlock: null,
        coAdvisor: null,
        status: "Submitted",
        createdAt: "2024-12-11T22:17:50.792Z",
        updatedAt: "2024-12-11T22:17:50.792Z",
      },
    },
  ];

  const apresentacoesOptions = formatOptions(presentationsMock, "title");

  const handleFormSessaoApresentacoes = (
    data: FormSessaoOrdenarApresentacoesSchema
  ) => {};

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
          <option hidden>Selecione uma apresentação</option>
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
          {...register("apresentacao2")}
        >
          <option hidden>Selecione outra apresentação</option>
          {apresentacoesOptions?.map((op, i) => (
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
