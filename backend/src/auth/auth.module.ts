import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from 'src/payment/payment.controller';
import { PaymentService } from 'src/payment/payment.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports:[
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret:'your_jwt_secret', 
      signOptions:{expiresIn:'7d'},
    }),
    PaymentModule
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService]
})
export class AuthModule {}
