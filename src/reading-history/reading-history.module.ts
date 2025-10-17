import { Module } from '@nestjs/common';
import { ReadingHistoryService } from './reading-history.service';
import { ReadingHistoryController } from './reading-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReadingHistory,
  ReadingHistorySchema,
} from './schemas/reading-history.schema';
import { BooksModule } from 'src/books/books.module';
import { ReadersModule } from 'src/readers/readers.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReadingHistory.name,
        schema: ReadingHistorySchema,
      },
    ]),
    BooksModule,
    ReadersModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [ReadingHistoryController],
  providers: [ReadingHistoryService, ExceptionHandlerHelper],
})
export class ReadingHistoryModule {}
