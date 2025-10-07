import {
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsString,
  IsStrongPassword,
  MaxLength,
  Validate,
} from 'class-validator';
import { CustomPasswordConfirmValidation } from 'src/common/validations/CustomPasswordConfirm.validation';

export class CreateUserDto {
  @IsString()
  term: string;
  @IsString()
  @IsLowercase()
  @MaxLength(20)
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;

  @Validate(CustomPasswordConfirmValidation)
  passwordConfirm: string;
  @IsBoolean()
  status: boolean;
}
