import { Expose } from 'class-transformer';

export class EventEditionResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  callForPapersText: string;

  @Expose()
  partnersText: string;

  @Expose()
  url: string;

  @Expose()
  location: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  submissionDeadline: Date;

  @Expose()
  isActive: boolean;

  @Expose()
  isEvaluationRestrictToLoggedUsers: boolean;

  @Expose()
  presentationDuration: number;

  @Expose()
  presentationsPerPresentationBlock: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<EventEditionResponseDto>) {
    Object.assign(this, partial);
  }
}
