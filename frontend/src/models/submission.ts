import { UUID } from "crypto";

export interface SubmissionParams {
    title: string;
    abstractText: string;
    advisorId: UUID;
    coAdvisor?: string;
    dateSuggestion?: Date;
    pdfFile: string;
    phoneNumber: string;
}

export interface GetSubmissionParams {
    eventEditionId: UUID;
    withouPresentation?: boolean;
    orderByProposedPresentation?: boolean;
    showConfirmedOnly?: boolean;
}

export interface Submission extends SubmissionParams {
    id: UUID;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
}
