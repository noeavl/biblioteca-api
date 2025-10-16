import {
  IsBoolean,
  IsEmail,
  IsLowercase,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { CustomPasswordConfirmValidation } from 'src/common/validations/CustomPasswordConfirm.validation';

export class CreateUserDto {
  @IsString()
  role: string;
  @IsString()
  @IsLowercase()
  @MaxLength(20)
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsStrongPassword()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @Validate(CustomPasswordConfirmValidation)
  passwordConfirm: string;
  @IsBoolean()
  status: boolean;
}
