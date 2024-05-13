import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePurchaseDto } from '../purchase/dto/create-purchase.dto';
import * as process from 'process';
import { message } from '../constants/constants';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  async createPaymentIntent(dto: CreatePurchaseDto[]) {
    const sum: number[] = dto.map((p) => p.amount * p.price);
    const resultSum: number = sum.reduce(
      (startValue, value) => startValue + value,
      0,
    );
    if (resultSum < 1) {
      throw new UnprocessableEntityException(message.INTENT_CANNOT_BE_CREATED);
    }

    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: Number(resultSum) * 100,
        currency: process.env.CURRENCY,
        payment_method_types: [process.env.PAYMENT_METHOD_TYPES],
      };

      const paymentIntent =
        await this.stripe.paymentIntents.create(paymentIntentParams);

      return {
        paymentIntentID: paymentIntent.id,
        creationTime: paymentIntent.created,
      };
    } catch (error) {
      throw new UnprocessableEntityException(message.INTENT_CANNOT_BE_CREATED);
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentToken: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentToken || 'pm_card_visa',
        },
      );

      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        confirmedPaymentIntent.id,
      );

      if (paymentIntent.status === 'succeeded') {
        return paymentIntent;
      } else {
        throw new UnprocessableEntityException(message.PAYMENT_CONFIRM_FAILED);
      }
    } catch (error) {
      throw new UnprocessableEntityException(message.PAYMENT_CONFIRM_FAILED);
    }
  }
}
