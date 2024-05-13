import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../auth/strategies/google.strategy';
import { GoogleGuard } from '../guards/google.guard';
import { UserModule } from '../user/user.module';
import { JwtModuleWrapper } from '../jwt/jwt.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GoogleGuard],
  imports: [UserModule, JwtModuleWrapper],
})
export class AuthModule {}
