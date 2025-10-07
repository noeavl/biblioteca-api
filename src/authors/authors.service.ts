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
      const authorCreated = await this.authorModel.insertOne(author);
      return authorCreated;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.authorModel.find().populate('person');
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
    try {
      const { person } = await this.findOne(id);
      const personUpdated = await this.personModel.findOneAndUpdate(
        { _id: person },
        updateAuthorDto,
        { new: true },
      );

      return personUpdated;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
  async remove(id: string) {
    try {
      const { person } = await this.findOne(id);
      await this.authorModel.deleteOne({ _id: id });
      await this.personModel.deleteOne({ _id: person });
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
