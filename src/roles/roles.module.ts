import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema, Role } from './schemas/roles.schema';
import { ExceptionHandlerHelper } from 'src/common/helpers/exception-handler.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, ExceptionHandlerHelper],
  exports: [RolesService],
})
export class RolesModule {}
