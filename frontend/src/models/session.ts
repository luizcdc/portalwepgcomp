/* eslint-disable @typescript-eslint/no-unused-vars */

type SessaoTipo = "General" | "Presentation";
interface SessaoParams {
    type: SessaoTipo;
    eventEditionId: string;
    roomId: string;
    startTime: string;
    title?: string;
    speakerName?: string;
    duration?: string;
    apresentacoes?: string[];
    avaliadores?: string[];
}

interface Sessao extends SessaoParams {
    id: string,
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}