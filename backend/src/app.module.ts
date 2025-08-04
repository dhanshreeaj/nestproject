import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './products/product.controller';
import { ProductService } from './products/product.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController, PaymentController, ProductController],
  providers: [AppService, AuthService, PaymentService, ProductService],
})
export class AppModule {}
