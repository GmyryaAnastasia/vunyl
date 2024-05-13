import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtServiceWrapper } from '../jwt/jwt.service.wrapper';
import { message } from '../constants/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private newJwtService: JwtServiceWrapper) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.cookies.token;
      const user = this.newJwtService.verify(token);
      req.userID = user.id;
      req.email = user.email;
      req.role = user.role;

      return true;
    } catch (e) {
      throw new HttpException(message.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
  }
}
