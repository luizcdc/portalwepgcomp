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
      bookmarked: true
    },
  })
  bookmarked: boolean;

  constructor(bookmarked: boolean) {
    this.bookmarked = bookmarked;
  }
}