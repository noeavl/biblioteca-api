import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @IsOptional()
  @IsString()
  fileName?: string;
}
