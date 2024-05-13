import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entity/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from '../review/dto/create-review.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Action } from '../enums/action.enum';
import { message } from '../constants/constants';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getRecordReviews(
    recordID: string,
    filters: { page: number; size: number },
  ) {
    const reviews = await this.reviewRepository.find({
      where: { recordID },
      take: filters.size,
      skip: filters.size * (filters.page - 1),
    });
    if (!reviews) {
      throw new HttpException(message.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return reviews;
  }

  async createReview(userID: string, recordID: string, dto: CreateReviewDto) {
    const newReview = await this.reviewRepository.save({
      ...dto,
      userID: userID,
      recordID: recordID,
    });
    await this.calculateAverageReviewScore(recordID);
    this.eventEmitter.emit('createUserAction', {
      action: Action.CREATE,
      entity: 'review',
      entityID: newReview.recordID,
      details: 'create review',
    });

    return newReview;
  }

  async deleteReview(recordID: string, reviewID: string) {
    await this.reviewRepository.delete({ reviewID });
    await this.calculateAverageReviewScore(recordID);
    this.eventEmitter.emit('createUserAction', {
      action: Action.DELETE,
      entity: 'review',
      entityID: reviewID,
      details: 'Delete review',
    });
  }

  async calculateAverageReviewScore(recordID: string) {
    const reviews: Review[] = await this.reviewRepository.find({
      where: { recordID },
    });
    const userScoreTotal: number = reviews.reduce(
      (accumulator: number, review: Review) => accumulator + review.user_score,
      0,
    );
    const result: number = userScoreTotal / reviews.length;
    this.eventEmitter.emit('newScore', {
      recordID,
      result,
    });
  }
}
