import { BadRequestException, Injectable, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { BooksService } from 'src/books/books.service';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
    private readonly bookService: BooksService,
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
}
