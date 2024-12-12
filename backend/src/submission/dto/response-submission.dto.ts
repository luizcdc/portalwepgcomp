import { Submission, SubmissionStatus } from '@prisma/client';

export class ResponseSubmissionDto {
  id: string;
  advisorId: string;
  mainAuthorId: string;
  eventEditionId: string;
  title: string;
  abstract: string;
  pdfFile: string;
  phoneNumber: string;
  proposedPresentationBlockId?: string;
  proposedPositionWithinBlock?: number;
  proposedStartTime?: Date;
  coAdvisor?: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(submission: Submission, proposedStartTime?: Date) {
    this.id = submission.id;
    this.advisorId = submission.advisorId;
    this.mainAuthorId = submission.mainAuthorId;
    this.eventEditionId = submission.eventEditionId;
    this.title = submission.title;
    this.abstract = submission.abstract;
    this.pdfFile = submission.pdfFile;
    this.phoneNumber = submission.phoneNumber;
    this.proposedPresentationBlockId = submission.proposedPresentationBlockId;
    this.proposedPositionWithinBlock = submission.proposedPositionWithinBlock;
    this.proposedStartTime = proposedStartTime;
    this.coAdvisor = submission.coAdvisor;
    this.status = submission.status;
    this.createdAt = submission.createdAt;
    this.updatedAt = submission.updatedAt;
  }
}
