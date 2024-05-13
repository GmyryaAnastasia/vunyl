import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from '../entity/purchase.entity';
import { Repository } from 'typeorm';
import { StripeService } from '../stripe/stripe.service';
import { CreatePurchaseDto } from '../purchase/dto/create-purchase.dto';
import Stripe from 'stripe';
import { SendEmailService } from '../util/email/sendEmail.service';
import { Cron } from '@nestjs/schedule';
import { Action } from '../enums/action.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { message } from '../constants/constants';
import { Status } from '../enums/status.enum';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private stripeService: StripeService,
    private sendEmailService: SendEmailService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrder(userID: string, dto: CreatePurchaseDto[]) {
    const paymentIntent: {
      paymentIntentID: string;
      creationTime: number;
    } = await this.stripeService.createPaymentIntent(dto);
    const purchases: {
      userID: string;
      recordID: string;
      orderNumber: string;
      amount: number;
    }[] = dto.map((purchase) => ({
      userID,
      recordID: purchase.recordID,
      orderNumber: paymentIntent.paymentIntentID,
      amount: purchase.amount,
    }));
    if (paymentIntent) {
      await this.purchaseRepository.save(purchases);

      return {
        paymentIntentID: paymentIntent,
        time: paymentIntent.creationTime,
      };
    }
  }
  async confirmPayment(
    userEmail: string,
    paymentIntentID: string,
    creationTime: number,
    paymentToken: string,
  ) {
    const currentTime: number = Math.floor(Date.now() / 1000);
    const timeDifferenceInMinutes: number = (currentTime - creationTime) / 60;

    const order: Purchase[] = await this.purchaseRepository.find({
      where: { orderNumber: paymentIntentID },
    });

    if (timeDifferenceInMinutes > 5) {
      await this.purchaseRepository.remove(order);
      throw new HttpException(message.EXPIRED_TIME, HttpStatus.BAD_REQUEST);
    } else {
      const payment: Stripe.PaymentIntent =
        await this.stripeService.confirmPaymentIntent(
          paymentIntentID,
          paymentToken,
        );

      if (payment) {
        order.forEach((o) => {
          o.orderStatus = Status.PAID;
        });

        await this.purchaseRepository.save(order);
        await this.sendEmailService.sendEmail(userEmail);
        this.eventEmitter.emit('createUserAction', {
          action: Action.CREATE,
          entity: 'purchase',
          entityID: paymentIntentID,
          details: 'create purchase',
        });
      }
    }
  }

  @Cron('* 5  * * * *')
  async deletePendingPurchases() {
    await this.purchaseRepository.delete({ orderStatus: Status.PENDIND });
  }
}
