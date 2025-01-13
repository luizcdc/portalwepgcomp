import {
  PresentationStatus,
  PanelistStatus,
  Profile,
  UserLevel,
  PresentationBlockType,
} from '@prisma/client';

export class ResponsePresentationDto {
  id: string;
  submissionId: string;
  presentationBlockId: string;
  positionWithinBlock: number;
  status: PresentationStatus;
  startTime: Date;
  createdAt: Date;
  updatedAt: Date;
  submission: ResponseSubmissionDto;

  constructor(presentation: any, submissionDto: ResponseSubmissionDto) {
    this.id = presentation.id;
    this.submissionId = presentation.submissionId;
    this.presentationBlockId = presentation.presentationBlockId;
    this.positionWithinBlock = presentation.positionWithinBlock;
    this.status = presentation.status;
    this.startTime = presentation.startTime;
    this.createdAt = presentation.createdAt;
    this.updatedAt = presentation.updatedAt;
    this.submission = submissionDto;
  }
}

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
  coAdvisor?: string;
  status: PresentationStatus;
  createdAt: Date;
  updatedAt: Date;
  mainAuthor: ResponseUserDto;
  advisor: ResponseUserDto | null;

  constructor(
    submission: any, 
    mainAuthor: { id: string; name: string; email: string },
    advisor: { id: string; name: string; email: string } | null,
  ) {
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
    this.coAdvisor = submission.coAdvisor;
    this.status = submission.status;
    this.createdAt = submission.createdAt;
    this.updatedAt = submission.updatedAt;
    this.mainAuthor = new ResponseUserDto(mainAuthor);
    this.advisor = advisor ? new ResponseUserDto(advisor) : null;
  }
}

async function createResponsePresentationDto(presentation: any, userLoader: (id: string) => Promise<any>) {
  const mainAuthor = await userLoader(presentation.submission.mainAuthorId);
  const advisor = presentation.submission.advisorId ? await userLoader(presentation.submission.advisorId) : null;
  const submissionDto = new ResponseSubmissionDto(presentation.submission, mainAuthor, advisor);
  return new ResponsePresentationDto(presentation, submissionDto);
}

export class ResponsePanelistDto {
  id: string;
  presentationBlockId: string;
  userId: string;
  status: PanelistStatus;
  createdAt: Date;
  updatedAt: Date;
  user: ResponseUserDto;

  constructor(panelist: any) {
    this.id = panelist.id;
    this.presentationBlockId = panelist.presentationBlockId;
    this.userId = panelist.userId;
    this.status = panelist.status;
    this.createdAt = panelist.createdAt;
    this.updatedAt = panelist.updatedAt;
    this.user = new ResponseUserDto(panelist.user);
  }
}

export class ResponseUserDto {
  id: string;
  name: string;
  email: string;
  profile: Profile;
  level: UserLevel;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.profile = user.profile;
    this.level = user.level;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class availablePositionsWithInBlockDto {
  positionWithinBlock: number;
  startTime: Date;

  constructor(position: number, startTime: Date) {
    this.positionWithinBlock = position;
    this.startTime = startTime;
  }
}

export class ResponsePresentationBlockDto {
  id: string;
  eventEditionId: string;
  roomId: string;
  type: PresentationBlockType;
  title: string;
  speakerName: string;
  startTime: Date;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  presentations: ResponsePresentationDto[];
  panelists: ResponsePanelistDto[];
  availablePositionsWithInBlock: availablePositionsWithInBlockDto[];

  constructor(block: any, presentations: ResponsePresentationDto[], panelists: ResponsePanelistDto[]) {
    this.id = block.id;
    this.eventEditionId = block.eventEditionId;
    this.roomId = block.roomId;
    this.type = block.type;
    this.title = block.title;
    this.speakerName = block.speakerName;
    this.startTime = block.startTime;
    this.duration = block.duration;
    this.createdAt = block.createdAt;
    this.updatedAt = block.updatedAt;
    this.presentations = presentations;
    this.panelists = panelists;

    this.availablePositionsWithInBlock = block.availablePositionsWithinBlock
      ? block.availablePositionsWithinBlock.map(
          (pos) =>
            new availablePositionsWithInBlockDto(
              pos.positionWithinBlock,
              pos.startTime,
            ),
        )
      : [];
  }

  static async create(block: any, userLoader: (id: string) => Promise<any>): Promise<ResponsePresentationBlockDto> {
    const presentations = await Promise.all(
      (block.presentations || []).map(async (presentation: any) => 
        createResponsePresentationDto(presentation, userLoader)
    )
    );

    const panelists = (block.panelists || []).map((panelist: any) => new ResponsePanelistDto(panelist));
    
    return new ResponsePresentationBlockDto(block, presentations, panelists);
  }
}
