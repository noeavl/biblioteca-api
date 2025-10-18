import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CreateRoleDto } from 'src/roles/dto/create-role-.dto';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

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
    await this.connection.collection('people').deleteMany();
    await this.connection.collection('favorites').deleteMany();
    await this.connection.collection('readers').deleteMany();
    await this.connection.collection('collections').deleteMany();
    await this.connection.collection('categories').deleteMany();
    await this.connection.collection('readinghistories').deleteMany();
    await this.connection.collection('authors').deleteMany();
    await this.connection.collection('books').deleteMany();

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
        role: 'admin',
        name: 'noe',
        email: 'admin@example.com',
        password: bcrypt.hashSync('Password123.', 10),
        passwordConfirm: 'Password123.',
        status: true,
      },
      {
        role: 'librarian',
        name: 'maria',
        email: 'librarian@example.com',
        password: bcrypt.hashSync('Password123.', 10),
        passwordConfirm: 'Password123.',
        status: true,
      },
      {
        role: 'reader',
        name: 'juan',
        email: 'reader@example.com',
        password: bcrypt.hashSync('Password123.', 10),
        passwordConfirm: 'Password123.',
        status: true,
      },
    ];

    await this.roleService.batchCreate(roles);
    await this.userService.batchCreate(users);

    return 'Seed executed succesfully';
  }
}
