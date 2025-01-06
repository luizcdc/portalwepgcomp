export const ModalSessaoMock = {
  confirmButton: {
    label: "Salvar",
  },
  titulo: {
    cadastro: "Cadastrar sessão",
    edicao: "Editar sessão",
  },
  tipo: {
    label: "Tipo de sessão",
    options: [
      { value: "General", label: "Sessão geral do evento" },
      { value: "Presentation", label: "Sessão de apresentações" },
    ],
  },
  formGeralFields: {
    titulo: {
      label: "Título",
      placeholder: "Insira o título da sua sessão",
    },
    nome: {
      label: "Nome do(a) palestrante",
      placeholder: "Insira o título do(a) palestrante",
    },
    sala: {
      label: "Sala do evento",
      placeholder: "Selecione a sala do evento",
      options: [
        {
          id: "2df1e06d-cd7f-4fc8-9ec1-47f2548d0333",
          eventEditionId: "c6204b5c-6a5b-45d0-878d-c88319825199",
          name: "Sala A",
          description: "The main hall for presentations.",
          createdAt: "2024-11-21T01:43:06.611Z",
          updatedAt: "2024-11-21T01:43:06.611Z",
        },
      ],
    },
    inicio: {
      label: "Data e horário de início da sessão",
      placeholder: "(ex.: 22/10/2024 20:00)",
    },
    final: {
      label: "Data e horário de fim da sessão",
      placeholder: "(ex.: 22/10/2024 20:00)",
    },
  },
  formApresentacoesFields: {
    apresentacoes: {
      label: "Apresentações",
      placeholder: "Selecione as apresentações",
      options: [
        {
          id: "529ac0f5-da94-4d73-bc53-8ef255c714cc",
          presentationBlockId: "290891e7-df2a-40d0-9882-2c2c6cce968c",
          positionWithinBlock: 1,
          presentationTime: "2024-05-01T12:20:00.000Z",
          submission: {
            id: "d71c3dd6-a433-4d5a-961f-e931f4165074",
            advisorId: "980f9547-7406-4f80-9640-b52809b260bf",
            mainAuthorId: "980f9547-7406-4f80-9640-b52809b260bf",
            eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
            title: "The Impact of AI in Modern Research",
            abstract:
              "A study on how AI impacts modern research methodologies.",
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
          id: "922c0caa-9f07-446c-a5ce-9c6d23a58196",
          presentationBlockId: "290891e7-df2a-40d0-9882-2c2c6cce968c",
          positionWithinBlock: 2,
          presentationTime: "2024-05-01T12:40:00.000Z",
          submission: {
            id: "b158cb90-fc6a-44c4-ad17-27082e703fa2",
            advisorId: "f15967f1-8229-46c7-afad-cafc32d7ec5e",
            mainAuthorId: "b3e222f3-687c-4979-88c2-24e7914a3a0b",
            eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
            title: "string",
            abstract: "stringstri",
            pdfFile: "string",
            phoneNumber: "string",
            proposedPresentationBlockId: "290891e7-df2a-40d0-9882-2c2c6cce968c",
            proposedPositionWithinBlock: 2,
            coAdvisor: null,
            status: "Confirmed",
            createdAt: "2024-12-14T19:53:56.215Z",
            updatedAt: "2024-12-14T19:56:06.162Z",
          },
        },
      ],
    },
    n_apresentacoes: {
      label: "Número máximo de apresentações para essa sessão",
      placeholder: "Ex. 4",
    },
    sala: {
      label: "Sala do evento",
      placeholder: "Selecione a sala do evento",
      options: [
        {
          id: "2df1e06d-cd7f-4fc8-9ec1-47f2548d0333",
          eventEditionId: "c6204b5c-6a5b-45d0-878d-c88319825199",
          name: "Sala A",
          description: "The main hall for presentations.",
          createdAt: "2024-11-21T01:43:06.611Z",
          updatedAt: "2024-11-21T01:43:06.611Z",
        },
      ],
    },
    inicio: {
      label: "Data e horário de início da sessão",
      placeholder: "(ex.: 22/10/2024 20:00)",
    },
    avaliadores: {
      label: "Avaliadores",
      placeholder: "Selecione os avaliadores",
      options: [
        {
          id: "151fde49-1fa2-4f7b-95ef-1f51a73e8ff6",
          eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
          userId: "4feb98ae-62c0-4ae2-a594-a8f45593515c",
          level: "Committee",
          name: "Avaliador 1",
          role: "ITSupport",
          createdAt: "2024-11-21T01:43:06.601Z",
          updatedAt: "2024-11-21T01:43:06.601Z",
        },
      ],
    },
  },
};
