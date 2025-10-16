import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { Book } from 'src/books/schemas/book.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    private readonly exceptionHandlerHelper: ExceptionHandlerHelper,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const categoryFound = await this.categoryModel.findOne({
        name: createCategoryDto.name,
      });
      if (categoryFound) {
        throw new BadRequestException(
          `The ${createCategoryDto.name} category already exists`,
        );
      }
      await this.categoryModel.insertOne(createCategoryDto);
      return {
        message: 'Category created successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'Category');
    }
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(term: string) {
    let categoryFound: HydratedDocument<Category> | null = null;

    if (isValidObjectId(term)) {
      categoryFound = await this.categoryModel.findOne({ _id: term });
    }

    if (!categoryFound) {
      categoryFound = await this.categoryModel.findOne({ name: term });
    }

    if (!categoryFound) {
      throw new NotFoundException(`Category ${term} not found`);
    }

    return categoryFound;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const categoryFound = await this.findOne(id);
      await categoryFound.updateOne(updateCategoryDto);
      return {
        message: `Category ${id} updated successfully`,
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async addBooks(
    category: HydratedDocument<Category>,
    book: HydratedDocument<Book>,
  ) {
    try {
      return await this.categoryModel.findByIdAndUpdate(
        category,
        { $push: { books: book } },
        { new: true },
      );
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.findOne(id);
      await category.deleteOne({ _id: id });
      return {
        message: 'Category removed successfully',
      };
    } catch (error) {
      this.exceptionHandlerHelper.handleExceptions(error, 'Category');
    }
  }
}
