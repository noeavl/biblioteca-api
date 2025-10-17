import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('seed')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  seed() {
    return this.seedService.executeSeed();
  }
}
