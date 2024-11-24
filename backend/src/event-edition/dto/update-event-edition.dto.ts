import { PartialType } from '@nestjs/mapped-types';
import { CreateEventEditionDto } from './create-event-edition.dto';

export class UpdateEventEditionDto extends PartialType(CreateEventEditionDto) {}
