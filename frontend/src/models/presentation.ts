/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Presentation {
  id: string;
  presentationBlockId: string;
  positionWithinBlock: number;
  presentationTime: string;
  submission: Submission;
}

export interface PresentationBookmarkRegister {
  presentationId: string;
}

export interface Submission {
  id: string;
  advisorId: string;
  advisor: UserAccount;
  mainAuthorId: string;
  mainAuthor: UserAccount;
  eventEditionId: string;
  title: string;
  type: string;
  abstract: string;
  pdfFile: string;
  phoneNumber: string;
  proposedPresentationBlockId: any;
  proposedPositionWithinBlock: any;
  coAdvisor: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string
  name: string
  email: string
  registrationNumber: string
  photoFilePath: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}