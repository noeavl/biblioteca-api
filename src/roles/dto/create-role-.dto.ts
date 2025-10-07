import { IsLowercase, IsString, Max } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsLowercase()
  @Max(25)
  name: string;
}
