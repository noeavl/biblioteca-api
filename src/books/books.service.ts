import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import { ExceptionHandlerHelper } from '../common/helpers/exception-handler.helper';
import { AuthorsService } from 'src/authors/authors.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly authorService: AuthorsService,
    private readonly categoryService: CategoriesService,
  ) {}
  async create(createBookDto: CreateBookDto) {
    try {
      const categoryFound = await this.categoryService.findOne(
        createBookDto.categoryId,
      );
      const author = await this.authorService.findOne(createBookDto.authorId);
      const createdBook = await this.bookModel.insertOne({
        author: author,
        ...createBookDto,
        category: categoryFound,
      });
      await this.categoryService.addBooks(categoryFound, createdBook);
      await this.authorService.addBooks(author, createdBook);
      return {
        message: 'Book created successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async findAll(limit: number = 10, skip: number = 0) {
    return await this.bookModel
      .find()
      .populate([
        {
          path: 'author',
          select: '-books',
          populate: { path: 'person' },
        },
        {
          path: 'category',
          select: '-books',
        },
      ])
      .limit(limit)
      .skip(skip);
  }

  async findOne(term: string): Promise<HydratedDocument<Book>> {
    let bookFound: HydratedDocument<Book> | null = null;
    if (isValidObjectId(term)) {
      bookFound = await this.bookModel
        .findOne({ _id: term })
        .populate('author');
    }
    if (!bookFound) {
      bookFound = await this.bookModel
        .findOne({ name: term })
        .populate('author');
    }

    if (!bookFound) throw new NotFoundException(`Book ${term} not found`);
    return bookFound;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      const bookFound = await this.findOne(id);
      await this.bookModel
        .findByIdAndUpdate(bookFound, updateBookDto, { new: true })
        .populate({ path: 'author', populate: { path: 'person' } });
      return {
        message: 'Book updated successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    await this.authorService.removeBook(book.author, id);
    await this.bookModel.deleteOne({ _id: id });
    return {
      message: `Book ${id} removed successfully`,
    };
  }
}
