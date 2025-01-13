import {
  Submission,
  Presentation,
  SubmissionStatus,
  UserAccount,
} from '@prisma/client';

export class PresentationResponseDto {
  id: string;
  presentationBlockId: string;
  positionWithinBlock: number;
  presentationTime: Date;
  publicAverageScore?: number;
  evaluatorsAverageScore?: number;
  submission: {
    id: string;
    advisorId: string;
    advisor?: {
      name: string;
      email: string;
    };
    mainAuthorId: string;
    mainAuthor?: {
      name: string;
      email: string;
    };
    eventEditionId: string;
    title: string;
    abstract: string;
    pdfFile: string;
    phoneNumber: string;
    proposedPresentationBlockId?: string;
    proposedPositionWithinBlock?: number;
    coAdvisor?: string;
    status: SubmissionStatus;
    createdAt: Date;
    updatedAt: Date;
  };

  constructor(
    presentation: Presentation & {
      submission: Submission & {
        mainAuthor?: UserAccount;
        advisor?: UserAccount;
      };
    },
    presentationTime: Date,
  ) {
    this.id = presentation.id;
    this.presentationBlockId = presentation.presentationBlockId;
    this.positionWithinBlock = presentation.positionWithinBlock;
    this.presentationTime = presentationTime;
    this.publicAverageScore = presentation.publicAverageScore;
    this.evaluatorsAverageScore = presentation.evaluatorsAverageScore;

    this.submission = {
      id: presentation.submission.id,
      advisorId: presentation.submission.advisorId,
      advisor: presentation.submission.advisor,
      mainAuthorId: presentation.submission.mainAuthorId,
      mainAuthor: presentation.submission.mainAuthor,
      eventEditionId: presentation.submission.eventEditionId,
      title: presentation.submission.title,
      abstract: presentation.submission.abstract,
      pdfFile: presentation.submission.pdfFile,
      phoneNumber: presentation.submission.phoneNumber,
      proposedPresentationBlockId:
        presentation.submission.proposedPresentationBlockId,
      proposedPositionWithinBlock:
        presentation.submission.proposedPositionWithinBlock,
      coAdvisor: presentation.submission.coAdvisor,
      status: presentation.submission.status,
      createdAt: presentation.submission.createdAt,
      updatedAt: presentation.submission.updatedAt,
    };
  }
}
