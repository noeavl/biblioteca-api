import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReadingHistoryService } from './reading-history.service';
import { CreateReadingHistoryDto } from './dto/create-reading-history.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('reading-history')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'reader')
export class ReadingHistoryController {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}

  @Post()
  create(@Body() createReadingHistoryDto: CreateReadingHistoryDto) {
    return this.readingHistoryService.create(createReadingHistoryDto);
  }

  @Get()
  findAll() {
    return this.readingHistoryService.findAll();
  }

  @Delete(':id/:book')
  remove(
    @Param('id', new ParseMongoIdPipe()) id: string,
    @Param('book', new ParseMongoIdPipe()) book: string,
  ) {
    return this.readingHistoryService.remove(id, book);
  }
}
