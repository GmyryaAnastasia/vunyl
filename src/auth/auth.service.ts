import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

import { User } from '../entity/user.entity';
import { UserData } from '../@types/express';
import { JwtServiceWrapper } from '../jwt/jwt.service.wrapper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private nestJwtService: JwtServiceWrapper,
  ) {}

  async login(user: UserData) {
    const existingUser: User = await this.userService.findUserByEmail(
      user.email,
    );

    if (!existingUser) {
      const newUser: {
        picture: Buffer;
        email: string;
        firstName: string;
        lastName: string;
      } & User = await this.userService.createUser(user);
      const accessToken: string = await this.nestJwtService.createToken(
        newUser.id,
        newUser.role,
        newUser.email,
      );

      return {
        access_token: accessToken,
      };
    }

    const accessToken: string = await this.nestJwtService.createToken(
      existingUser.id,
      existingUser.role,
      existingUser.email,
    );

    return {
      access_token: accessToken,
    };
  }
}
