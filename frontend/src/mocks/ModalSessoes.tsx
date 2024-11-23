export const ModalSessaoMock = {
  confirmButton: {
    label: "Salvar",
  },
  eventEditionId: "61300cbf-7bc2-41e9-9563-639c6ac02f40",
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
          id: "33e6d1b8-d11a-4d3c-92c5-0571d233ddf7",
          eventEditionId: "61300cbf-7bc2-41e9-9563-639c6ac02f40",
          name: "Main Conference Hall",
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
          id: "61ea4792-8115-4abd-889f-15afb4e1ef51",
          name: "Apresentação 1",
          submissionId: "781c52ba-9718-47e8-a14f-59cfacc6d7ff",
          presentationBlockId: "840af921-dd38-4d89-b5df-891df656fa4c",
          positionWithinBlock: 1,
          status: "ToPresent",
          createdAt: "2024-11-21T01:43:06.618Z",
          updatedAt: "2024-11-21T01:43:06.618Z",
        },
      ],
    },
    sala: {
      label: "Sala do evento",
      placeholder: "Selecione a sala do evento",
      options: [
        {
          id: "33e6d1b8-d11a-4d3c-92c5-0571d233ddf7",
          eventEditionId: "61300cbf-7bc2-41e9-9563-639c6ac02f40",
          name: "Main Conference Hall",
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
          id: "aced8c8c-e597-4fd7-872d-97cb543830e9",
          eventEditionId: "61300cbf-7bc2-41e9-9563-639c6ac02f40",
          userEd: "c73c2c5a-b6ee-4d8e-a47a-5c159728f2ea",
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
