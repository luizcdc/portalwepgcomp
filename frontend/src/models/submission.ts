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

export interface Submission extends SubmissionParams {
    id: UUID;
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}
