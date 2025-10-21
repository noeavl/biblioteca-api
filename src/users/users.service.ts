import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import { RolesService } from 'src/roles/roles.service';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly roleService: RolesService,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { role, password, ...userData } = createUserDto;
    try {
      const roleFound = await this.roleService.findOne(role);

      const createdUser = new this.userModel({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        role: roleFound._id,
      });

      await createdUser.save();

      return createdUser;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'User');
    }
  }

  async batchCreate(createUsersDto: CreateUserDto[]) {
    try {
      const terms = [...new Set(createUsersDto.map((dto) => dto.role))];

      const rolesFound = await this.roleService.findAll(terms);

      const roleMap = new Map(rolesFound.map((role) => [role.name, role._id]));

      const users = createUsersDto.map(({ role, ...data }) => ({
        ...data,
        role: roleMap.get(role),
      }));

      const createdUsers = await this.userModel.insertMany(users);

      return createdUsers;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'User');
    }
  }

  async findAll() {
    return this.userModel
      .find()
      .limit(10)
      .skip(0)
      .sort({ name: 1 })
      .populate('role');
  }

  async findOne(term: string): Promise<HydratedDocument<User>> {
    let userFound: HydratedDocument<User> | null = null;

    if (isValidObjectId(term)) {
      userFound = await this.userModel.findOne({ _id: term }).populate('role');
    }

    if (!userFound) {
      userFound = await this.userModel
        .findOne({ email: term })
        .populate('role', 'name')
        .select('name email password role status');
    }

    if (!userFound) {
      throw new NotFoundException(`User ${term} not found`);
    }

    return userFound;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userFound = await this.findOne(id);
      if (updateUserDto) {
        const { role, password, passwordConfirm, ...userData }: UpdateUserDto =
          updateUserDto;

        if (password && password === passwordConfirm) {
          userFound.password = bcrypt.hashSync(password, 10);
        }

        if (role) {
          const roleFound = await this.roleService.findOne(role);
          userFound.role = roleFound;
        }

        Object.assign(userFound, userData);

        await userFound.save();
      }
      return {
        message: `User ${id} updated successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'User');
    }
  }

  async remove(term: string) {
    try {
      const userFound = await this.findOne(term);
      await this.userModel.deleteOne({ _id: userFound._id });
      return {
        message: 'User removed successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
