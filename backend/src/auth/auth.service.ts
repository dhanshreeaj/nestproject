// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendVerificationEmail } from 'src/utils/verification';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService:JwtService,
  ) {}

//google sign
  getGoogleOAuthUrl(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
   const options = {
  client_id: process.env.GOOGLE_CLIENT_ID!,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
  response_type: 'code',
  scope: 'openid email profile',
};

const params = new URLSearchParams(options);

    return `${rootUrl}?${params.toString()}`;
  }

  async handleGoogleCallback(code: string, res: any) {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const access_token = tokenRes.data.access_token;

    const profileRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const { name, email } = profileRes.data;

    if (!email) throw new Error('Email not found in Google response');

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: 'google_oauth_dummy_password',
          isVerified: true,
        },
      });
    }

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email,},
      { secret: process.env.JWT_SECRET, expiresIn: '1d' },
    );

    res.redirect(`http://localhost:3000/home?token=${token}`);
  }

  //register 
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
     
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    await sendVerificationEmail(email, code);

    return { message: 'Verification code sent to email' };
  }

  //verify with otp
  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const record = await this.prisma.verificationCode.findUnique({
      where: { userId: user.id },
    });

    if (!record || record.code !== code || new Date() > record.expiresAt) {
      throw new Error('Invalid or expired code');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await this.prisma.verificationCode.delete({ where: { userId: user.id } });

    return { message: 'Email successfully verified' };
  }


  //login with tokens
  async login(email:string,password:string){
    const user=await this.prisma.user.findUnique({where:{email}});
    if(!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid) throw new UnauthorizedException('Invalid Password');

    if(!user.isVerified)
      throw new UnauthorizedException('Pleasw verify your email first');

    const payload={
      sub:user.id,
      email:user.email,
    };
    const token=this.jwtService.sign(payload);

    return{
      message:'Login successful',
      token,
      user:{
        id:user.id,
        email:user.email,
        name:user.name,
      },
    };
  }

}