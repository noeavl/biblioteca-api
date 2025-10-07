import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { HydratedDocument, Model } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly roleService: RolesService,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<HydratedDocument<User> | undefined> {
    const { term, ...userData } = createUserDto;
    try {
      const role = await this.roleService.findOne(term);

      const createdUser = new this.userModel({
        ...userData,
        role: role._id,
      });

      const savedUser = await createdUser.save();

      // Actualizar el rol con el ID del usuario creado
      await this.roleService.addUserToRole(role._id.toString(), savedUser._id);

      return savedUser;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'User');
    }
  }

  async batchCreate(createUsersDto: CreateUserDto[]) {
    try {
      const terms = [...new Set(createUsersDto.map((dto) => dto.term))];

      const rolesFound = await this.roleService.findAll(terms);

      const roleMap = new Map(rolesFound.map((role) => [role.name, role._id]));

      const users = createUsersDto.map(({ term, ...data }) => ({
        ...data,
        role: roleMap.get(term),
      }));

      const createdUsers = await this.userModel.insertMany(users);

      for (const user of createdUsers) {
        if (user.role) {
          await this.roleService.addUserToRole(user.role.toString(), user._id);
        }
      }

      return createdUsers;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'User');
    }
  }

  async findAll() {
    return this.userModel.find().limit(10).skip(0).sort({ name: 1 });
  }

  async findOne(id: string): Promise<HydratedDocument<User>> {
    const userFound = await this.userModel.findOne({ id: id });
    if (!userFound) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return userFound;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<HydratedDocument<User>> {
    const userFound = await this.findOne(id);

    try {
      await userFound.updateOne(updateUserDto);
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'User');
    }

    return userFound;
  }
}
