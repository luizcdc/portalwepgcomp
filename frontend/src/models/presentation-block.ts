/* eslint-disable @typescript-eslint/no-unused-vars */

interface User {
    id: string;
    name: string;
    email: string;
    profile: string;
    level: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
  
interface Submission {
    id: string;
    advisorId: string;
    mainAuthorId: string;
    eventEditionId: string;
    title: string;
    abstract: string;
    pdfFile: string;
    phoneNumber: string;
    proposedPresentationBlockId: string | null;
    proposedPositionWithinBlock: number | null;
    coAdvisor: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}
  
interface Presentation {
    id: string;
    submissionId: string;
    presentationBlockId: string;
    positionWithinBlock: number;
    status: string;
    startTime: string;
    createdAt: string;
    updatedAt: string;
    submission: Submission;
}
  
interface Panelist {
    id: string;
    presentationBlockId: string;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}
  
interface AvailablePosition {
    positionWithinBlock: number;
    startTime: string;
}
  
interface PresentationBlock {
    id: string;
    eventEditionId: string;
    roomId: string;
    type: string;
    title: string | null;
    speakerName: string | null;
    startTime: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
    presentations: Presentation[];
    panelists: Panelist[];
    availablePositionsWithInBlock: AvailablePosition[];
}
  