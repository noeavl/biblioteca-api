import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { BooksModule } from 'src/books/books.module';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { ReadersModule } from 'src/readers/readers.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Collection.name,
        schema: CollectionSchema,
      },
    ]),
    BooksModule,
    ReadersModule,
    ConfigModule,
    JwtModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService, ExceptionHandlerHelper],
})
export class CollectionsModule {}
