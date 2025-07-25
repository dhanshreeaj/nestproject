import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from 'src/payment/payment.controller';
import { PaymentService } from 'src/payment/payment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret:'your_jwt_secret', 
      signOptions:{expiresIn:'7d'},
    }),
  ],
  controllers: [AuthController,PaymentController],
  providers: [AuthService,PrismaService,PaymentService]
})
export class AuthModule {}
