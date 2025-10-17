import { IsMongoId, IsString } from 'class-validator';

export class CreateReadingHistoryDto {
  @IsString()
  @IsMongoId()
  reader: string;
  @IsString()
  @IsMongoId()
  book: string;
}
