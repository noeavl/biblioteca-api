import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { ReadersService } from './readers.service';
// import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateReaderDto } from './dto/create-reader.dto';

@Controller('readers')
export class ReadersController {
  constructor(private readonly readersService: ReadersService) {}

  @Post()
  create(@Body() createReaderDto: CreateReaderDto) {
    return this.readersService.create(createReaderDto);
  }

  @Get()
  findAll() {
    return this.readersService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.readersService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseMongoIdPipe()) id: string,
    @Body() updateReaderDto: UpdateReaderDto,
  ) {
    return this.readersService.update(id, updateReaderDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseMongoIdPipe()) id: string) {
    return this.readersService.remove(id);
  }
}
