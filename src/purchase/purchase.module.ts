import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '../entity/purchase.entity';
import { StripeModule } from '../stripe/stripe.module';
import { JwtModuleWrapper } from '../jwt/jwt.module';
import { SendEmailService } from '../util/email/sendEmail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    StripeModule.forRootAsync(),
    JwtModuleWrapper,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, SendEmailService],
})
export class PurchaseModule {}
