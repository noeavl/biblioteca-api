import {
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsMongoId()
  reader: string;
  @IsString()
  @MaxLength(150)
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  @IsIn(['private', 'public'])
  visibility: string;
}
