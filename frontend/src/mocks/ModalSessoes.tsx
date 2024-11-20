export const ModalSessaoMock = {
  confirmButton: {
    label: "Salvar",
  },
  tipo: {
    label: "Tipo de sessão",
    options: ["Sessão geral do evento", "Sessão de apresentações"],
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
      options: ["Sala 1", "Sala 2"],
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
      options: ["Apresentação 1", "Apresentação 2"],
    },
    sala: {
      label: "Sala do evento",
      placeholder: "Selecione a sala do evento",
      options: ["Sala 1", "Sala 2"],
    },
    inicio: {
      label: "Data e horário de início da sessão",
      placeholder: "(ex.: 22/10/2024 20:00)",
    },
    avaliadores: {
      label: "Avaliadores",
      placeholder: "Selecione os avaliadores",
      options: ["Avaliador 1", "Avaliador 2"],
    },
  },
};
