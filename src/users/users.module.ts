import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RolesModule } from 'src/roles/roles.module';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ExceptionHandlerHelper],
  exports: [UsersService],
})
export class UsersModule {}
