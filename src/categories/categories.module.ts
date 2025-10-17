import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, ExceptionHandlerHelper],
  exports: [CategoriesService],
})
export class CategoriesModule {}
