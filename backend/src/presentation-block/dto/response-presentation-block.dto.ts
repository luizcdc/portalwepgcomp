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
  createdAt: Date;
  updatedAt: Date;

  constructor(presentation: any) {
    this.id = presentation.id;
    this.submissionId = presentation.submissionId;
    this.presentationBlockId = presentation.presentationBlockId;
    this.positionWithinBlock = presentation.positionWithinBlock;
    this.status = presentation.status;
    this.createdAt = presentation.createdAt;
    this.updatedAt = presentation.updatedAt;
  }
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

  constructor(block: any) {
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

    // Add null checks
    this.presentations = block.presentations
      ? block.presentations.map(
          (presentation) => new ResponsePresentationDto(presentation),
        )
      : [];

    this.panelists = block.panelists
      ? block.panelists.map((panelist) => new ResponsePanelistDto(panelist))
      : [];

    // Use the correct property name from the previous logs
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
}
