import { PartialType } from '@nestjs/mapped-types';
import { CreateReadingHistoryDto } from './create-reading-history.dto';

export class UpdateReadingHistoryDto extends PartialType(
  CreateReadingHistoryDto,
) {}
