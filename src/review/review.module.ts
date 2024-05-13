import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../entity/review.entity';
import { JwtModuleWrapper } from '../jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), JwtModuleWrapper],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
