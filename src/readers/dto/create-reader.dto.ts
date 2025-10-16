import { IntersectionType } from '@nestjs/mapped-types';
import { CreatePersonDto } from 'src/common/dto/person/create-person.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateReaderDto extends IntersectionType(
  CreateUserDto,
  CreatePersonDto,
) {}
