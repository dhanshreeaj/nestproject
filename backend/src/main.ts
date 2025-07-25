import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { ConfigModule } from '@nestjs/config';

import {json,urlencoded} from 'express';

dotenv.config();

async function bootstrap() {
  ConfigModule.forRoot({
  isGlobal: true,
});

  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

app.use(urlencoded({ extended: false }));

  // ✅ Raw body for Razorpay webhook
  app.use('/payment/webhook', json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  }));

  // Normal JSON parsing for other routes
  app.use(json());

  await app.listen(3001);
}
bootstrap();