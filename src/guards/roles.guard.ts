import {CanActivate, ExecutionContext, ForbiddenException, Injectable,} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Roles} from '../decorator/roles.decorator';
import {message} from '../constants/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new ForbiddenException(message.NO_PERMISSION);
    }

    return true;
  }
}
