import { PartialType } from '@nestjs/mapped-types';
import { CreatePresentationDto } from './create-presentation.dto';

export class UpdatePresentationDto extends PartialType(CreatePresentationDto) {}
