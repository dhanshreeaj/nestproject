import { Controller, Post, Body,   Req,
  Res,
  HttpCode,
  HttpStatus,} from '@nestjs/common';
import { PaymentService } from './payment.service';

import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { CreateOrderDto } from 'src/dto/createorder';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService,
  ) {}

  //payment
  @Post('create-order')
  async createOrder(@Body('amount') amount: number) {
    const order = await this.paymentService.createOrder(amount);
    return order;
  }


//webhook
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Req()  req:Request, @Res() res:Response){
     const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature =req.headers['x-razorpay-signature'] as string;

    const generatedSignature=crypto
    .createHmac('sha256',secret)
    .update((req as any).rawBody)
    .digest('hex');

    if(signature === generatedSignature){
      console.log('Webhook Verified');
      console.log('Event:',req.body);

      return res.status(200).json({status:'ok'});
    }else{
      console.warn('Invalid signature');
      return res.status(400).json({error:'Invalid signature'});
    }
  }

  //comfirm order
  @Post('confirm-order')
  async confirmOrder(@Body() dto:CreateOrderDto){
    return this.paymentService.confirmOrder(dto);
  }
}