import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { BooksModule } from 'src/books/books.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ExceptionHandlerHelper],
  imports: [ConfigModule, BooksModule],
})
export class FilesModule {}
