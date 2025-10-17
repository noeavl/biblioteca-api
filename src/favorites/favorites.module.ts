import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { BooksModule } from 'src/books/books.module';
import { ReadersModule } from 'src/readers/readers.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: FavoriteSchema,
        name: Favorite.name,
      },
    ]),
    BooksModule,
    ReadersModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, ExceptionHandlerHelper],
})
export class FavoritesModule {}
