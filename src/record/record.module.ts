import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../entity/record.entity';
import { JwtModuleWrapper } from '../jwt/jwt.module';
import { PictureService } from '../util/picture/picture.service';
import { TelegramBotService } from '../util/telegram/telegram-bot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), JwtModuleWrapper],
  controllers: [RecordController],
  providers: [RecordService, PictureService, TelegramBotService],
})
export class RecordModule {}
