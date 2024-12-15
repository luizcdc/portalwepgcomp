
/* eslint-disable @typescript-eslint/no-unused-vars */
interface Submission {
    abstract: string;
    advisorId: string;
    coAdvisor: string | null;
    createdAt: string;
    eventEditionId: string;
    id: string;
    mainAuthorId: string;
    pdfFile: string;
    phoneNumber: string;
    proposedPositionWithinBlock: number | null;
    proposedPresentationBlockId: string | null;
    status: string;
    title: string;
    updatedAt: string;
}
    
interface ResponsePresentation {
    createdAt: string;
    id: string;
    positionWithinBlock: number;
    presentationBlockId: string;
    startTime: string;
    status: string;
    submission: Submission;
}