import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from './prisma/prisma.module'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, PrismaModule,JwtModule.register({
        secret:'your_jwt_secret', 
        signOptions:{expiresIn:'7d'},
      }),],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
