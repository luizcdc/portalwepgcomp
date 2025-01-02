/* eslint-disable @typescript-eslint/no-unused-vars */

interface SubmissionParams {
    eventEditionId: string;
    mainAuthorId: string;
    title: string;
    abstractText: string;
    advisorId: string;
    coAdvisor?: string;
    dateSuggestion?: Date;
    pdfFile: string;
    phoneNumber: string;
}

interface GetSubmissionParams {
    eventEditionId: string;
    withouPresentation?: boolean;
    orderByProposedPresentation?: boolean;
    showConfirmedOnly?: boolean;
}

interface Submission extends SubmissionParams {
    id: string;
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    mainAuthor: UserProfile;
}
