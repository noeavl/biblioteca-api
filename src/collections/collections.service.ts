import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from './schemas/collection.schema';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import { BooksService } from 'src/books/books.service';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { ReadersService } from 'src/readers/readers.service';
import { CreateCollectionBookDto } from './dto/create-collection-book.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<Collection>,
    private readonly bookService: BooksService,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly readerService: ReadersService,
  ) {}
  async create(createCollectionDto: CreateCollectionDto) {
    const { reader } = createCollectionDto;
    try {
      await this.readerService.findOne(reader);
      const collectionCreated =
        await this.collectionModel.insertOne(createCollectionDto);

      return collectionCreated;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }

    return 'This action adds a new collection';
  }

  async findAll() {
    return await this.collectionModel
      .find()
      .skip(0)
      .limit(10)
      .sort({ name: 1 });
  }

  async findOne(term: string) {
    let collectionFound: HydratedDocument<Collection> | null = null;
    try {
      if (isValidObjectId(term)) {
        collectionFound = await this.collectionModel.findOne({ _id: term });
      }

      if (!collectionFound) {
        collectionFound = await this.collectionModel.findOne({ name: term });
      }

      if (!collectionFound) {
        throw new NotFoundException(`Collection ${term} not found`);
      }

      return collectionFound;
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async addBook(createCollectionBook: CreateCollectionBookDto) {
    const { book, collection } = createCollectionBook;

    try {
      const collectionFound = await this.findOne(collection);
      const bookFound = await this.bookService.findOne(book);

      await this.collectionModel.findByIdAndUpdate(collectionFound, {
        $addToSet: { books: bookFound },
      });
      return {
        message: `Book ${book} added to collection ${collection} successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async removeBook(collectionId: string, bookId: string) {
    try {
      await this.findOne(collectionId);
      await this.bookService.findOne(bookId);

      const bookFoundInCollection = await this.collectionModel.findOne({
        _id: collectionId,
        books: { $in: [bookId] },
      });

      if (!bookFoundInCollection) {
        throw new ConflictException(
          `Book ${bookId} not found in collection ${collectionId}`,
        );
      }

      await this.collectionModel.findByIdAndUpdate(collectionId, {
        $pull: { books: bookId },
      });
      return {
        message: `Book ${bookId} removed to collection ${collectionId} successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    try {
      await this.findOne(id);

      await this.collectionModel.updateOne(updateCollectionDto);
      return {
        message: `Collection ${id} updated successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }

    return `This action updates a #${id} collection`;
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.collectionModel.deleteOne({ _id: id });
      return {
        message: `Collection ${id} removed successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
    return;
  }
}
