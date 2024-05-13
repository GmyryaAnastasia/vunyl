import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from '../purchase/purchase.service';
import { CreatePurchaseDto } from '../purchase/dto/create-purchase.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/auth.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { message } from '../constants/constants';
import { responseSchema } from '../purchase/response-schema/response-schema';

@ApiTags('Purchase')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: message.UNAUTHORIZED })
@UseGuards(JwtAuthGuard)
@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @ApiOperation({ summary: 'Create order and paymentIntent' })
  @ApiOkResponse({
    description: message.SUCCESS,
    content: responseSchema,
  })
  @ApiBody({ type: [CreatePurchaseDto] })
  @Post()
  async createOrder(
    @Req() req: Request,
    @Body() dto: CreatePurchaseDto[],
    @Res() res: Response,
  ) {
    const data = await this.purchaseService.createOrder(req.userID, dto);
    res.send(data);
  }

  @ApiOperation({ summary: 'Confirm paymentIntent' })
  @ApiOkResponse({ description: message.SUCCESS })
  @Post('confirm-payment-intent/:paymentIntentID/:creationTime')
  confirmPayment(
    @Req() req: Request,
    @Param('paymentIntentID') paymentIntentID: string,
    @Param('creationTime') creationTime: number,
    @Query('paymentToken') paymentToken: string,
  ) {
    return this.purchaseService.confirmPayment(
      req.email,
      paymentIntentID,
      creationTime,
      paymentToken,
    );
  }
}
