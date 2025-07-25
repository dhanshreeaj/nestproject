import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({
      secret:'your_jwt_secret', 
      signOptions:{expiresIn:'7d'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService]
})
export class AuthModule {}
