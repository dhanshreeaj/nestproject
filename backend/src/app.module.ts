import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),AuthModule, PrismaModule,JwtModule.register({
        secret:'your_jwt_secret', 
        signOptions:{expiresIn:'7d'},
      }),],
  controllers: [AppController,PaymentController],
  providers: [AppService, AuthService,PaymentService],
})
export class AppModule {}
