export interface BookmarkedPresentations {
  bookmarkedPresentations: Bookmark[];
}

export interface Bookmark {
    id: string;
    submissionId: string;
    presentationBlockId: string;
    positionWithinBlock: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    publicAverageScore: number | null;
    evaluatorsAverageScore: number | null;
    submission: Submission;
}
  
export interface Submission {
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
    mainAuthor: Author;
    advisor: Advisor;
}
  
export interface Author {
    name: string;
    email: string;
}

export interface Advisor {
    name: string;
}
  
  