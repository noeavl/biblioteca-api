import { Module } from '@nestjs/common';
import { ReadersService } from './readers.service';
import { ReadersController } from './readers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reader, ReaderSchema } from './schemas/reader.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { UsersModule } from 'src/users/users.module';
import { Person } from 'src/common/schemas/person.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reader.name, schema: ReaderSchema },
      { name: Person.name, schema: Person },
    ]),
    ConfigModule,
    JwtModule,
    UsersModule,
  ],
  controllers: [ReadersController],
  providers: [ReadersService, ExceptionHandlerHelper],
  exports: [ReadersService],
})
export class ReadersModule {}
