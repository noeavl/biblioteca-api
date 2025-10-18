import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from './schemas/author.schema';
import { isValidObjectId, Model, HydratedDocument } from 'mongoose';
import { Person } from 'src/common/schemas/person.schema';
import { ExceptionHandlerHelper } from '../common/helpers/exception-handler.helper';
import { Book } from 'src/books/schemas/book.schema';
@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private readonly authorModel: Model<Author>,
    @InjectModel(Person.name)
    private readonly personModel: Model<Person>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const personCreated = await this.personModel.insertOne(createAuthorDto);
      const author: Author = {
        person: personCreated,
      };
      await this.authorModel.insertOne(author);
      return {
        message: 'Author created successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async findAll(skip: number = 0, limit: number = 10) {
    return await this.authorModel
      .find()
      .populate('person')
      .skip(skip)
      .limit(limit)
      .sort({ firstName: 1 });
  }

  async findOne(term: string): Promise<HydratedDocument<Author>> {
    let authorFound: HydratedDocument<Author> | null = null;

    if (isValidObjectId(term))
      authorFound = await this.authorModel
        .findOne({ _id: term })
        .populate('person');

    if (!authorFound)
      authorFound = await this.authorModel
        .findOne({ name: term })
        .populate('person')
        .exec();

    if (!authorFound) throw new NotFoundException(`Author ${term} not found`);
    return authorFound;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const { fileName, ...personData } = updateAuthorDto;
    try {
      const authorFound = await this.findOne(id);

      if (fileName !== undefined) {
        authorFound.fileName = fileName;
      }

      await authorFound.save();

      await this.personModel.updateOne(authorFound.person, personData);

      return {
        message: `Author ${id} updated successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
  async remove(id: string) {
    try {
      const { person } = await this.findOne(id);
      await this.authorModel.deleteOne({ _id: id });
      await this.personModel.deleteOne({ _id: person });
      return {
        message: `Author ${id} removed successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async addBooks(
    author: HydratedDocument<Author>,
    book: HydratedDocument<Book>,
  ) {
    try {
      return await this.authorModel.findByIdAndUpdate(
        author,
        { $push: { books: book } },
        { new: true },
      );
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
  async removeBook(author: Author, bookId: string) {
    try {
      return await this.authorModel.findByIdAndUpdate(
        author,
        {
          $pull: { books: bookId },
        },
        { new: true },
      );
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
