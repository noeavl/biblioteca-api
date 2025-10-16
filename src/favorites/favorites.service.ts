import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './schemas/favorite.schema';
import { Model } from 'mongoose';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { BooksService } from 'src/books/books.service';
import { ReadersService } from 'src/readers/readers.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<Favorite>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly bookService: BooksService,
    private readonly readerService: ReadersService,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    const { book, reader } = createFavoriteDto;

    try {
      const bookFound = await this.bookService.findOne(book);
      await this.readerService.findOne(reader);

      const favoriteFound = await this.favoriteModel.findOne({
        books: { $in: [book] },
        reader,
      });

      if (favoriteFound) {
        throw new ConflictException(
          `This book ${book} already exists in favorites`,
        );
      }

      const favoriteCreated =
        await this.favoriteModel.insertOne(createFavoriteDto);

      favoriteCreated.books.push(bookFound);
      await favoriteCreated.save();
      return {
        message: 'Favorite created successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.favoriteModel
      .find()
      .populate(['books', 'reader'])
      .skip(0)
      .limit(10);
  }

  async remove(id: string, book: string) {
    try {
      const favoriteFound = await this.favoriteModel.findOne({
        _id: id,
        books: { $in: [book] },
      });
      if (!favoriteFound) {
        throw new NotFoundException(`Book ${book} not found in favorites`);
      }
      await this.favoriteModel.updateOne(
        { _id: id },
        { $pull: { books: book } },
      );
      return {
        message: 'Favorite removed successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
