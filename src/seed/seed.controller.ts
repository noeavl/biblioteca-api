import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('seed')
@UseGuards(AuthGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  seed() {
    return this.seedService.executeSeed();
  }
}
