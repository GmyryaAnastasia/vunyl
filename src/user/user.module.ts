import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModuleWrapper } from '../jwt/jwt.module';
import { PictureService } from '../util/picture/picture.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModuleWrapper],
  controllers: [UserController],
  providers: [UserService, PictureService],
  exports: [UserService],
})
export class UserModule {}
