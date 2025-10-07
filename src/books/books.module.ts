import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    AuthorsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, ExceptionHandlerHelper],
  exports: [BooksService],
})
export class BooksModule {}
