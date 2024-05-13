import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../entity/log.entity';
import { JwtModuleWrapper } from '../jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Log]), JwtModuleWrapper],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
