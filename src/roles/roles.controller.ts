import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('roles')
@UseGuards(AuthGuard)
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
