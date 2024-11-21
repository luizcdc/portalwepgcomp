/* eslint-disable @typescript-eslint/no-unused-vars */

type SessaoTipo = "Sessão geral do evento" | "Sessão de apresentacoes";
interface SessaoParams {
    tipo: SessaoTipo;
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