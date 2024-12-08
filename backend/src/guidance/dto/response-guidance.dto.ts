import { Guidance } from '@prisma/client';

export class ResponseGuidanceDto {
  id: string;
  summary: string;
  authorGuidance: string;
  reviewerGuidance: string;
  audienceGuidance: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(guidance: Guidance) {
    this.id = guidance.id;
    this.summary = guidance.summary;
    this.authorGuidance = guidance.authorGuidance;
    this.reviewerGuidance = guidance.reviewerGuidance;
    this.audienceGuidance = guidance.audienceGuidance;
    this.createdAt = guidance.createdAt;
    this.updatedAt = guidance.updatedAt;
  }
}
