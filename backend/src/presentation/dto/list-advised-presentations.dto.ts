import { ApiProperty } from '@nestjs/swagger';
import { PresentationStatus } from '@prisma/client';

export class ListAdvisedPresentationsResponse {
  id: string;
  submissionId: string;
  presentationBlockId: string;
  positionWithinBlock: number;

  @ApiProperty({
    enum: ['ToPresent', 'Presented', 'NotPresented'],
  })
  status: PresentationStatus;

  createdAt: Date;
  updatedAt: Date;
  publicAverageScore?: number;
  evaluatorsAverageScore?: number;
}
