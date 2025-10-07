import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateRoleDto } from 'src/roles/dto/create-role-.dto';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  async executeSeed() {
    await this.connection.collection('roles').deleteMany();
    await this.connection.collection('users').deleteMany();

    const roles: CreateRoleDto[] = [
      {
        name: 'admin',
      },
      {
        name: 'librarian',
      },
      {
        name: 'executive',
      },
      {
        name: 'reader',
      },
    ];

    const users: CreateUserDto[] = [
      {
        term: 'admin',
        name: 'noe',
        email: 'admin@example.com',
        password: 'Password123.',
        passwordConfirm: 'Password123.',
        status: true,
      },
      {
        term: 'librarian',
        name: 'maria',
        email: 'librarian@example.com',
        password: 'Password123.',
        passwordConfirm: 'Password123.',
        status: true,
      },
      {
        term: 'reader',
        name: 'juan',
        email: 'reader@example.com',
        password: 'Password123.',
        passwordConfirm: 'Password123.',
        status: true,
      },
    ];

    await this.roleService.batchCreate(roles);
    await this.userService.batchCreate(users);

    return 'Seed executed succesfully';
  }
}
