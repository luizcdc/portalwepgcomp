"use client";

import FormSessaoOrdenarApresentacoes from "@/components/Forms/SessaoOrdenarApresentacoes/FormSessaoOrdenarApresentacoes";
import "./style.scss";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";

export default function ModalSessaoOrdenarApresentacoes() {
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
      submission: {
        id: "d71c3dd6-a433-4d5a-961f-e931f4165074",
        advisorId: "980f9547-7406-4f80-9640-b52809b260bf",
        mainAuthorId: "980f9547-7406-4f80-9640-b52809b260bf",
        eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
        title: "The Impact of AI in Modern Research",
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
      submission: {
        id: "d71c3dd6-a433-4d5a-961f-e931f4165074",
        advisorId: "980f9547-7406-4f80-9640-b52809b260bf",
        mainAuthorId: "980f9547-7406-4f80-9640-b52809b260bf",
        eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
        title: "The Impact of AI in Modern Research 2",
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

  return (
    <ModalComponent
      id={"trocarOrdemApresentacao"}
      loading={false}
      labelConfirmButton="Confirmar"
    >
      <h3>Mudar ordenação das apresentações</h3>

      <div className="mt-4 mb-4">
        <p className="form-label fw-bold form-title">Ordem atual</p>
        {presentationsMock
          .toSorted((a, b) => a.positionWithinBlock - b.positionWithinBlock)
          .map((presentation) => (
            <p
              key={presentation.id}
            >{`${presentation?.positionWithinBlock} - ${presentation?.submission?.title}`}</p>
          ))}
      </div>
      <FormSessaoOrdenarApresentacoes />
    </ModalComponent>
  );
}
