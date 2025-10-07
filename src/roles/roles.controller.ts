import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get(':id')
  findOne(
    @Param(':id', new ParseMongoIdPipe())
    @Param('id')
    id: string,
  ) {
    return this.rolesService.findOne(id);
  }
}
