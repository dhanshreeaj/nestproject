import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { ConfigModule } from '@nestjs/config';

import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import * as express from 'express';
dotenv.config();

async function bootstrap() {
  ConfigModule.forRoot({
    isGlobal: true,
  });

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://www.stalliongrooming.com'],
    credentials: true,
  });
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use(urlencoded({ extended: false }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads/',
  // });

  // Raw body for Razorpay webhook
  app.use(
    '/payment/webhook',
    json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  // Normal JSON parsing for other routes
  app.use(json());

  // await app.listen(3001);
  app.listen(3001, '0.0.0.0', () => {
    console.log('Server running on port 3001');
  });
}
bootstrap();
