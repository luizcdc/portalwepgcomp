import { UUID } from "crypto";

export interface SubmissionFileParams {
    idSubmission: UUID;
    pdfFile: File;
}

export interface SubmissionFile extends SubmissionFileParams {
    id: UUID;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
}
