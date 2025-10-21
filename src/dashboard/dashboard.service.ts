import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  findAll() {
    return `This action returns all dashboard`;
  }
}
