import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './schemas/roles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role-.dto';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
  ) {}
  async findOne(term: string): Promise<HydratedDocument<Role>> {
    let roleFound: HydratedDocument<Role> | null = null;

    if (isValidObjectId(term))
      roleFound = await this.roleModel.findOne({ _id: term });

    if (!roleFound) roleFound = await this.roleModel.findOne({ name: term });

    if (!roleFound)
      throw new NotFoundException(`Role with term ${term} not found`);

    return roleFound;
  }

  async batchCreate(createRolesDto: CreateRoleDto[]) {
    try {
      const createdUsersDto = await this.roleModel.insertMany(createRolesDto);
      return createdUsersDto;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'Role');
    }
  }

  async findAll(names?: string[]) {
    let roles: HydratedDocument<Role>[] | null = null;

    if (names && names.length > 0) {
      roles = await this.roleModel.find({ name: { $in: names } });
    } else {
      roles = await this.roleModel.find();
    }

    return roles;
  }
}
