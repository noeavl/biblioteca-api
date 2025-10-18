import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileNamer } from 'src/common/helpers/fileNamer.helper';
import type { Response } from 'express';
import { FileFilter, ImageFileFilter } from 'src/common/helpers/file.helper';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('book/:pdfName')
  findBookPDF(@Res() res: Response, @Param('pdfName') pdfName: string) {
    const path = this.filesService.getBookPDF(pdfName);
    return res.sendFile(path);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @HttpCode(HttpStatus.OK)
  @Post('book/:bookId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilter,
      storage: diskStorage({
        destination: './upload/books',
        filename: FileNamer,
      }),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  uploadPDF(
    @Param('bookId', new ParseMongoIdPipe())
    bookId: string,
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadBookPDF(bookId, file);
  }

  @Get('author/:imageName')
  findAuthorImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getAuthorImage(imageName);
    return res.sendFile(path);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @HttpCode(HttpStatus.OK)
  @Post('author/:authorId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: ImageFileFilter,
      storage: diskStorage({
        destination: './upload/authors',
        filename: FileNamer,
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadAuthorImage(
    @Param('authorId', new ParseMongoIdPipe())
    authorId: string,
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadAuthorImage(authorId, file);
  }

  @Get('cover/:coverName')
  findBookCover(@Res() res: Response, @Param('coverName') coverName: string) {
    const path = this.filesService.getBookCover(coverName);
    return res.sendFile(path);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('cover/:bookId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: ImageFileFilter,
      storage: diskStorage({
        destination: './upload/covers',
        filename: FileNamer,
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadBookCover(
    @Param('bookId', new ParseMongoIdPipe())
    bookId: string,
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadBookCover(bookId, file);
  }
}
