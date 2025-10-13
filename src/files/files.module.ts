import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { BooksModule } from 'src/books/books.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ExceptionHandlerHelper],
  imports: [ConfigModule, BooksModule, JwtModule, ConfigModule],
})
export class FilesModule {}
