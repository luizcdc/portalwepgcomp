import { Profile, UserLevel, SubmissionStatus } from '@prisma/client';

export class UserDto {
  id: string;
  name: string;
  email: string;
  registrationNumber?: string;
  photoFilePath?: string;
  profile: Profile;
  level: UserLevel;
  isActive: boolean;
}

export class SubmissionDto {
  id: string;
  title: string;
  abstract: string;
  pdfFile: string;
  phoneNumber: string;
  coAdvisor?: string;
  status: SubmissionStatus;
  mainAuthor: UserDto;
}

export class PresentationDto {
  id: string;
  publicAverageScore: number | null;
  evaluatorsAverageScore: number | null;
  submission: SubmissionDto;
}

export class TopPanelistRankingResponseDto {
  data: PresentationDto[];
}

export class TopAudienceRankingResponseDto {
  data: PresentationDto[];
}
