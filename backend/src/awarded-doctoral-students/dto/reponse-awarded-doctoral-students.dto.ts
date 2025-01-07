import {
  Profile,
  UserLevel,
  SubmissionStatus,
  PresentationStatus,
} from '@prisma/client';

export class UserDto {
  id: string;
  name: string;
  email: string;
  registrationNumber?: string | null;
  photoFilePath?: string | null;
  profile: Profile;
  level: UserLevel;
  isActive: boolean;
  isVerified: boolean;

  constructor(user: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string | null;
    photoFilePath?: string | null;
    profile: Profile;
    level: UserLevel;
    isActive: boolean;
    isVerified: boolean;
  }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.registrationNumber = user.registrationNumber;
    this.photoFilePath = user.photoFilePath;
    this.profile = user.profile;
    this.level = user.level;
    this.isActive = user.isActive;
    this.isVerified = user.isVerified;
  }
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

  constructor(submission: {
    id: string;
    title: string;
    abstract: string;
    pdfFile: string;
    phoneNumber: string;
    coAdvisor?: string;
    status: SubmissionStatus;
    mainAuthor: UserDto;
  }) {
    this.id = submission.id;
    this.title = submission.title;
    this.abstract = submission.abstract;
    this.pdfFile = submission.pdfFile;
    this.phoneNumber = submission.phoneNumber;
    this.coAdvisor = submission.coAdvisor;
    this.status = submission.status;
    this.mainAuthor = submission.mainAuthor;
  }
}

export class RankingResponseDtoDto {
  id: string;
  presentationBlockId: string;
  positionWithinBlock: number;
  status: PresentationStatus;
  publicAverageScore: number | null;
  evaluatorsAverageScore: number | null;
  submission: SubmissionDto;

  constructor(presentation: any) {
    this.id = presentation.id;
    this.presentationBlockId = presentation.presentationBlockId;
    this.positionWithinBlock = presentation.positionWithinBlock;
    this.status = presentation.status;
    this.publicAverageScore = presentation.publicAverageScore;
    this.evaluatorsAverageScore = presentation.evaluatorsAverageScore;
    this.submission = new SubmissionDto({
      ...presentation.submission,
      mainAuthor: new UserDto(presentation.submission.mainAuthor),
    });
  }
}
