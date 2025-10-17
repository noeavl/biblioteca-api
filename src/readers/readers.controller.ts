import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReadersService } from './readers.service';
// import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateReaderDto } from './dto/create-reader.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('readers')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'librarian')
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
  @Roles('reader')
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
