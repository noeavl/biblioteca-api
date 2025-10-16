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
import { FileFilter } from 'src/common/helpers/file.helper';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('book/:pdfName')
  findBookPDF(@Res() res: Response, @Param('pdfName') pdfName: string) {
    const path = this.filesService.getBookPDF(pdfName);
    return res.sendFile(path);
  }

  @UseGuards(AuthGuard)
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
}
