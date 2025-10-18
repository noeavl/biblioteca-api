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
import { Favorite } from 'src/favorites/schemas/favorite.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<Favorite>,
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
    const categories = await this.categoryModel.find().lean();

    const categoriesWithFeaturedBook = await Promise.all(
      categories.map(async (category) => {
        if (!category.books || category.books.length === 0) {
          return { ...category, featuredBookCover: null };
        }

        // Obtener el conteo de favoritos para cada libro de la categoría
        const booksWithFavoriteCount = await Promise.all(
          category.books.map(async (bookId) => {
            const favoriteCount = await this.favoriteModel.countDocuments({
              books: bookId,
            });
            return { bookId, favoriteCount };
          }),
        );

        // Ordenar por favoritos (descendente)
        booksWithFavoriteCount.sort(
          (a, b) => b.favoriteCount - a.favoriteCount,
        );

        let featuredBookId;

        // Si el libro con más favoritos tiene al menos 1 favorito, usarlo
        if (booksWithFavoriteCount[0].favoriteCount > 0) {
          featuredBookId = booksWithFavoriteCount[0].bookId;
        } else {
          // Si no hay favoritos, obtener el libro más reciente
          const mostRecentBook = await this.bookModel
            .findOne({ _id: { $in: category.books } })
            .sort({ _id: -1 })
            .select('_id');

          featuredBookId = mostRecentBook?._id;
        }

        // Obtener la imagen de portada del libro destacado
        const featuredBook = await this.bookModel
          .findById(featuredBookId)
          .select('coverImage');

        return {
          ...category,
          featuredBookCover: featuredBook?.coverImage || null,
        };
      }),
    );

    return categoriesWithFeaturedBook;
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
