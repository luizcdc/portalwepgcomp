import { ApiProperty } from '@nestjs/swagger';
import { Presentation } from '@prisma/client';
import { IsUUID } from 'class-validator';

export class BookmarkPresentationRequestDto {
  @IsUUID()
  presentationId: string;
}

export class BookmarkPresentationResponseDto {
  @ApiProperty({
    type: Array<Presentation>,
    example: [
      {
        id: '61ea4792-8115-4abd-889f-15afb4e1ef51',
        submissionId: '781c52ba-9718-47e8-a14f-59cfacc6d7ff',
        presentationBlockId: '840af921-dd38-4d89-b5df-891df656fa4c',
        positionWithinBlock: 1,
        status: 'ToPresent',
        createdAt: '2024-11-20T22:43:06.618Z',
        updatedAt: '2024-11-20T22:43:06.618Z',
        publicAverageScore: 0,
        evaluatorsAverageScore: 0,
        submission: {
          id: 'bab59898-e80e-49be-9f53-2bc4171e207c',
          advisorId: 'c0f25572-e221-44ea-b9b6-bf0919e4ac48',
          mainAuthorId: '7bcaba70-7cc7-445d-ba49-c5fd03ea93ea',
          eventEditionId: 'efd7e911-a3c0-4164-9436-61fd58d5b49f',
          title: 'Quantum Computing Advances',
          abstract: 'Exploring the latest advancements in quantum computing.',
          pdfFile: 'path/to/document2.pdf',
          phoneNumber: '123-456-7891',
          proposedPresentationBlockId: null,
          proposedPositionWithinBlock: null,
          coAdvisor: null,
          status: 'Submitted',
          createdAt: '2025-01-04T03:39:22.166Z',
          updatedAt: '2025-01-04T03:39:22.166Z',
        },
      },
    ],
  })
  bookmarkedPresentations: Array<Presentation>;

  constructor(bookmarkedPresentations: Array<Presentation>) {
    this.bookmarkedPresentations = bookmarkedPresentations;
  }
}

export class BookmarkedPresentationsResponseDto {
  @ApiProperty({
    type: Array<Presentation>,
    example: [
      {
        id: '61ea4792-8115-4abd-889f-15afb4e1ef51',
        submissionId: '781c52ba-9718-47e8-a14f-59cfacc6d7ff',
        presentationBlockId: '840af921-dd38-4d89-b5df-891df656fa4c',
        positionWithinBlock: 1,
        status: 'ToPresent',
        createdAt: '2024-11-20T22:43:06.618Z',
        updatedAt: '2024-11-20T22:43:06.618Z',
        publicAverageScore: 0,
        evaluatorsAverageScore: 0,
        submission: {
          id: '6ef7dfc0-5df8-4250-bd5e-7dfbf3aaa00e',
          advisorId: '8cd1b6d6-db84-4cfe-bafe-b261e68ca4a5',
          mainAuthorId: '221a5b46-4817-4192-9b66-d92c1d1e8169',
          eventEditionId: 'efd7e911-a3c0-4164-9436-61fd58d5b49f',
          title: 'The Impact of AI in Modern Research',
          abstract: 'A study on how AI impacts modern research methodologies.',
          pdfFile: 'path/to/document1.pdf',
          phoneNumber: '123-456-7890',
          proposedPresentationBlockId: null,
          proposedPositionWithinBlock: null,
          coAdvisor: null,
          status: 'Submitted',
          createdAt: '2025-01-04T03:39:22.162Z',
          updatedAt: '2025-01-04T03:39:22.162Z',
        },
      },
    ],
  })
  bookmarkedPresentations: Array<Presentation>;

  constructor(bookmarkedPresentations: Presentation[]) {
    this.bookmarkedPresentations = bookmarkedPresentations;
  }
}

export class BookmarkedPresentationResponseDto {
  @ApiProperty({
    type: Object,
    example: {
      bookmarked: true,
    },
  })
  bookmarked: boolean;

  constructor(bookmarked: boolean) {
    this.bookmarked = bookmarked;
  }
}
