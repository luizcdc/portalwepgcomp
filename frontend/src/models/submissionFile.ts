/* eslint-disable @typescript-eslint/no-unused-vars */

interface SubmissionFileParams {
    idUser: string;
    pdfFile: File;
}

interface SubmissionFile extends SubmissionFileParams {
    id: string;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
}
