import { IsMongoId, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsMongoId()
  reader: string;
  @IsString()
  @IsMongoId()
  book: string;
}
