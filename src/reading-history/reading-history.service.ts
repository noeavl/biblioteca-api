import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReadingHistoryDto } from './dto/create-reading-history.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReadingHistory } from './schemas/reading-history.schema';
import { Model } from 'mongoose';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { BooksService } from 'src/books/books.service';
import { ReadersService } from 'src/readers/readers.service';

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectModel(ReadingHistory.name)
    private readonly readingHistoryModel: Model<ReadingHistory>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly bookService: BooksService,
    private readonly readerService: ReadersService,
  ) {}

  async create(createReadingHistoryDto: CreateReadingHistoryDto) {
    const { book, reader } = createReadingHistoryDto;

    try {
      const bookFound = await this.bookService.findOne(book);
      await this.readerService.findOne(reader);

      const historyFound = await this.readingHistoryModel.findOne({
        books: { $in: [book] },
        reader,
      });

      if (historyFound) {
        throw new ConflictException(
          `This book ${book} already exists in reading history`,
        );
      }

      await this.readingHistoryModel.create({
        reader,
        books: [bookFound._id],
      });

      return {
        message: 'Reading history created successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.readingHistoryModel
      .find()
      .populate(['books', 'reader'])
      .skip(0)
      .limit(10);
  }

  async remove(id: string, book: string) {
    try {
      const historyFound = await this.readingHistoryModel.findOne({
        _id: id,
        books: { $in: [book] },
      });
      if (!historyFound) {
        throw new NotFoundException(
          `Book ${book} not found in reading history`,
        );
      }
      await this.readingHistoryModel.updateOne(
        { _id: id },
        { $pull: { books: book } },
      );
      return {
        message: 'Reading history removed successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
