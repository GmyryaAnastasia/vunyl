import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleWrapper } from './jwt/jwt.module';
import { RecordModule } from './record/record.module';
import { ReviewModule } from './review/review.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StripeModule } from './stripe/stripe.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ScheduleModule } from '@nestjs/schedule';

import { LogModule } from './log/log.module';

import typeorm from './config/typeorm';

@Module({
  controllers: [],
  providers: [],
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),

    UserModule,
    AuthModule,
    JwtModuleWrapper,
    RecordModule,
    ReviewModule,
    StripeModule.forRootAsync(),
    PurchaseModule,
    ScheduleModule.forRoot(),
    LogModule,
  ],
})
export class AppModule {}
