/* eslint-disable @typescript-eslint/no-unused-vars */

interface OrientacaoParams {
    summary?: string;
    authorGuidance?: string;
    reviewerGuidance?: string;
    audienceGuidance?: string;
    eventEditionId: string;
}

interface Orientacao extends OrientacaoParams {
    id: string;
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}