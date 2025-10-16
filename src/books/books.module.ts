import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { AuthorsModule } from 'src/authors/authors.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    AuthorsModule,
    JwtModule,
    ConfigModule,
    CategoriesModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, ExceptionHandlerHelper],
  exports: [BooksService],
})
export class BooksModule {}
