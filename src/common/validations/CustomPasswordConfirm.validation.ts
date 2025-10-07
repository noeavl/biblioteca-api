import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ValidatorConstraint({ name: 'CustomPasswordConfirm', async: false })
export class CustomPasswordConfirmValidation
  implements ValidatorConstraintInterface
{
  validate(
    passwordConfirm: string,
    { object }: ValidationArguments,
  ): Promise<boolean> | boolean {
    const { password } = object as CreateUserDto;
    return password === passwordConfirm;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Password doesn't matched`;
  }
}
