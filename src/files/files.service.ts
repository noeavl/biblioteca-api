import { BadRequestException, Injectable, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { BooksService } from 'src/books/books.service';
import { AuthorsService } from 'src/authors/authors.service';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly bookService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}
  getBookPDF(pdfName: string) {
    const path = join(process.cwd(), 'upload/books', pdfName);

    if (!path)
      throw new BadRequestException(`No Book found with PDF ${pdfName}`);

    return path;
  }

  async uploadBookPDF(bookId: string, file: Express.Multer.File) {
    try {
      const book = await this.bookService.update(bookId, {
        fileName: file.originalname,
      });

      const secureUrl = `${this.configService.get('host')}/files/book/${file.filename}`;
      return { book, secureUrl };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  getAuthorImage(imageName: string) {
    const path = join(process.cwd(), 'upload/authors', imageName);

    if (!path)
      throw new BadRequestException(`No Author found with image ${imageName}`);

    return path;
  }

  async uploadAuthorImage(authorId: string, file: Express.Multer.File) {
    try {
      const author = await this.authorsService.update(authorId, {
        fileName: file.originalname,
      });

      const secureUrl = `${this.configService.get('host')}/files/author/${file.filename}`;
      return { author, secureUrl };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  getBookCover(coverName: string) {
    const path = join(process.cwd(), 'upload/covers', coverName);

    if (!path)
      throw new BadRequestException(`No Book found with cover ${coverName}`);

    return path;
  }

  async uploadBookCover(bookId: string, file: Express.Multer.File) {
    try {
      const book = await this.bookService.update(bookId, {
        coverImage: file.originalname,
      });

      const secureUrl = `${this.configService.get('host')}/files/cover/${file.filename}`;
      return { book, secureUrl };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }
}
