export const ModalSessaoMock = {
  confirmButton: {
    label: "Salvar",
  },
  eventEditionId: "e691f604-ea01-4ffa-9f77-3df417490ca2",
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
          id: "d513f05b-0968-4bd7-8bd3-c0c1256b1892",
          eventEditionId: "e691f604-ea01-4ffa-9f77-3df417490ca2",
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
          id: "1b9eed95-4ccc-4afe-96f9-d95f36700a81",
          name: "Apresentação 1",
          submissionId: "4eaa2ad4-eb6c-46cf-9406-e9047f8d7227",
          presentationBlockId: "fbf8f163-51f8-4287-b290-698f0dd75b62",
          positionWithinBlock: 1,
          status: "ToPresent",
          createdAt: "2024-11-21T01:43:06.618Z",
          updatedAt: "2024-11-21T01:43:06.618Z",
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
          id: "d513f05b-0968-4bd7-8bd3-c0c1256b1892",
          eventEditionId: "e691f604-ea01-4ffa-9f77-3df417490ca2",
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
          id: "151fde49-1fa2-4f7b-95ef-1f51a73e8ff6",
          eventEditionId: "e691f604-ea01-4ffa-9f77-3df417490ca2",
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
