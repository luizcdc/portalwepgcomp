import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePresentationBlockDto } from './create-presentation-block.dto';

export class UpdatePresentationBlockDto extends PartialType(
  OmitType(CreatePresentationBlockDto, [
    'eventEditionId',
    'panelists',
    'presentations',
  ] as const),
) {}
