import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from './schemas/author.schema';
import { Person, PersonSchema } from 'src/common/schemas/person.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService, ExceptionHandlerHelper],
  exports: [AuthorsService],
})
export class AuthorsModule {}
