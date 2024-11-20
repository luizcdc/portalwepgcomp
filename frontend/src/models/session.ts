/* eslint-disable @typescript-eslint/no-unused-vars */

enum SessaoTipoEnum {
    "Sessão geral do evento" = 1,
    "Sessão de apresentações" = 2,
};

interface SessaoParams {
    tipo: SessaoTipoEnum;
    sala: string;
    inicio: string;
    titulo?: string;
    nome?: string;
    final?: string;
    apresentacoes?: string[];
    avaliadores?: string[];
}

interface Sessao extends SessaoParams {
    id: string,
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}