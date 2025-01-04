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
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
    mainAuthor: UserAccount;
    advisor: UserAccount;
    proposedPresentationBlockId: any;
    proposedPositionWithinBlock: any;
    abstract?: string;
    type?: string;
    status?: string;
}


