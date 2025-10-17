import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JWTPayload } from '../../auth/interfaces /jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getClass());
    const request = context.switchToHttp().getRequest<Request>();
    if (!roles) {
      return true;
    }

    const user = request['user'] as JWTPayload;

    return this.matchRoles(roles, user);
  }
  private matchRoles(roles: string[], user: JWTPayload) {
    return roles.includes(user.role);
  }
}
