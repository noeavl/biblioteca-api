import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { Model, HydratedDocument, isValidObjectId } from 'mongoose';
import { Reader } from './schemas/reader.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { UsersService } from 'src/users/users.service';
import { Person } from 'src/common/schemas/person.schema';
import { CreatePersonDto } from 'src/common/dto/person/create-person.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdatePersonDto } from 'src/common/dto/person/update-person.dto';

@Injectable()
export class ReadersService {
  constructor(
    @InjectModel(Reader.name)
    private readonly readerModel: Model<Reader>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly userService: UsersService,
    @InjectModel(Person.name)
    private readonly personModel: Model<Person>,
  ) {}

  async create(createdReaderDto: CreateReaderDto) {
    const { ...personData }: CreatePersonDto = createdReaderDto;
    const { ...userData }: CreateUserDto = createdReaderDto;

    try {
      const user = await this.userService.create(userData);
      const person = await this.personModel.insertOne(personData);

      const userCreated = await this.readerModel.insertOne({
        user,
        person,
        suscription: false,
      });

      return userCreated;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.readerModel.find().populate(['user', 'person']);
  }

  async findOne(term: string) {
    let readerFound: HydratedDocument<Reader> | null = null;

    if (isValidObjectId(term)) {
      readerFound = await this.readerModel
        .findOne({ _id: term })
        .populate(['user', 'person']);
    }

    if (!readerFound) {
      readerFound = await this.readerModel
        .findOne({
          email: term,
        })
        .populate(['user', 'person']);
    }

    if (!readerFound) {
      throw new NotFoundException(`Reader ${term} not found`);
    }

    return readerFound;
  }

  async update(id: string, updateReaderDto: UpdateReaderDto) {
    const { ...personData }: UpdatePersonDto = updateReaderDto;
    const { ...userData }: UpdateUserDto = updateReaderDto;

    try {
      const readerFound = await this.findOne(id);
      await this.userService.update(readerFound.user.email, userData);
      await this.personModel.findByIdAndUpdate(readerFound.person, personData, {
        new: true,
      });
      await readerFound.updateOne({ suscription: readerFound.suscription });
      return {
        message: `Reader ${id} updated successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const readerFound = await this.findOne(id);
      await this.personModel.deleteOne({ _id: readerFound.person });
      await this.userService.remove(readerFound.user.email);
      await this.readerModel.deleteOne({ _id: id });
      return {
        message: `Reader ${id} removed successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
