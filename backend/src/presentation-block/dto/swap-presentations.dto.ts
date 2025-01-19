import { IsUUID } from 'class-validator';

export class SwapPresentationsDto {
  @IsUUID()
  presentation1Id: string;
  @IsUUID()
  presentation2Id: string;
}

export class SwapMltiplePresentationsDto {
  presentations: SwapPresentationsDto[];
}
