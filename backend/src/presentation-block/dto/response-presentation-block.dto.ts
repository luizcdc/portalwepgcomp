import { PresentationBlock, PresentationBlockType } from '@prisma/client';

export class ResponsePresentationBlockDto {
  id: string;
  eventEditionId: string;
  roomId?: string;
  type: PresentationBlockType;
  title?: string;
  speakerName?: string;
  startTime: Date;
  duration: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(presentationBlock: PresentationBlock) {
    this.id = presentationBlock.id;
    this.eventEditionId = presentationBlock.eventEditionId;
    this.roomId = presentationBlock.roomId;
    this.type = presentationBlock.type;
    this.title = presentationBlock.title;
    this.speakerName = presentationBlock.speakerName;
    this.startTime = presentationBlock.startTime;
    this.duration = presentationBlock.duration;
    this.createdAt = presentationBlock.createdAt;
    this.updatedAt = presentationBlock.updatedAt;
  }
}
