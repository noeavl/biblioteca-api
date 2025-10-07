import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileNamer } from 'src/common/helpers/fileNamer.helper';
import type { Response } from 'express';
import { FileFilter } from 'src/common/helpers/file.helper';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('book/:pdfName')
  findBookPDF(@Res() res: Response, @Param('pdfName') pdfName: string) {
    const path = this.filesService.getBookPDF(pdfName);
    console.log(path);
    return res.sendFile(path);
  }
  @Post('book/:bookId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilter,
      storage: diskStorage({
        destination: './upload/books',
        filename: FileNamer,
      }),
    }),
  )
  uploadPDF(
    @Param('bookId', new ParseMongoIdPipe()) bookId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadBookPDF(bookId, file);
  }
}
