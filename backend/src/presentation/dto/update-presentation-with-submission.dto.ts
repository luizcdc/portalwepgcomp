import { PartialType } from '@nestjs/mapped-types';
import { CreatePresentationWithSubmissionDto } from './create-presentation-with-submission.dto';

export class UpdatePresentationWithSubmissionDto extends PartialType(CreatePresentationWithSubmissionDto ) {}