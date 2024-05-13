import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceWrapper {
  constructor(private nestJwtService: JwtService) {}

  createToken(id: string, role: string, email: string) {
    const payload: { id: string; role: string; email: string } = {
      id,
      role,
      email,
    };

    return this.nestJwtService.signAsync(payload);
  }

  verify(token: string) {
    return this.nestJwtService.verify(token);
  }
}
