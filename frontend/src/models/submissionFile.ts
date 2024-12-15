import { UUID } from "crypto";

export interface SubmissionFileParams {
    idUser: UUID;
    pdfFile: File;
}

export interface SubmissionFile extends SubmissionFileParams {
    id: UUID;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
}
