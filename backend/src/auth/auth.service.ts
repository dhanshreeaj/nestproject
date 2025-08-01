// src/auth/auth.service.ts
import { Body, Injectable, NotFoundException, Post, Put, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendVerificationEmail } from 'src/utils/verification';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService:JwtService,private configService: ConfigService,
    
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
  // async login(email:string,password:string){
  //   const user=await this.prisma.user.findUnique({where:{email}});
  //   if(!user) throw new UnauthorizedException('Invalid credentials');

  //   const isPasswordValid = await bcrypt.compare(password,user.password);
  //   if(!isPasswordValid) throw new UnauthorizedException('Invalid Password');

  //   if(!user.isVerified)
  //     throw new UnauthorizedException('Pleasw verify your email first');

  //   const payload={
  //     sub:user.id,
  //     email:user.email,
  //   };
  //   const token=this.jwtService.sign(payload);

  //   return{
  //     message:'Login successful',
  //     token,
  //     user:{
  //       id:user.id,
  //       email:user.email,
  //       name:user.name,
  //     },
  //   };
  // }

  async login(email: string, password: string) {
  // First check if it's a regular user
  const user = await this.prisma.user.findUnique({ where: { email } });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET }
    );

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: 'user', // 🔥 KEY DIFFERENTIATOR
      },
    };
  }

  // If not a user, check if it's an admin
  const admin = await this.prisma.admin.findUnique({ where: { email } });

  if (admin) {
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const token = this.jwtService.sign(
      { sub: admin.id, email: admin.email },
      { secret: process.env.JWT_SECRET }
    );

    return {
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        type: 'admin', // 🔥 KEY DIFFERENTIATOR
      },
    };
  }

  // If neither found
  throw new UnauthorizedException('Invalid credentials');
}

  //forgot password

  async forgotPassword(email:string){
    const user=await this.prisma.user.findUnique({where:{email}});
    if(!user) throw new NotFoundException('User not found');
    const code=Math.floor(100000+Math.random() * 900000).toString();
    const expiresAt=new Date(Date.now()+10 * 60 * 1000);
    await this.prisma.verificationCode.upsert({
      where:{userId:user.id},
      update:{code,expiresAt},
      create:{
        userId:user.id,
        code,
        expiresAt,
      },
    });
    await sendVerificationEmail(email,code);
    return { message:'Reset code sent to email'};
  }


  //reset password
  async resetPassword(email:string,code:string,newPassword:string){
    const user=await this.prisma.user.findUnique({where:{email}});
    if(!user) throw new NotFoundException('User not found');

    const record=await this.prisma.verificationCode.findUnique({
      where:{userId:user.id},
    });
    if(!record || record.code !== code || new Date()> record.expiresAt){
      throw new UnauthorizedException('Invalid or expires code');
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);
    await this.prisma.user.update({
      where:{id:user.id},
      data:{password:hashedPassword},
    });
    await this.prisma.verificationCode.delete({where:{userId:user.id}});
    return{message:'Password successfully reset'};
  }


  //adminpage
  //get users detail
  async getAllUsers(){
    return this.prisma.user.findMany({
      select:{
        id:true,
        name:true,
        email:true,
        isVerified:true,
      }
    })
  }

  //delete user details
 async deleteUser(id:string){
  const user=await this.prisma.user.findUnique({where:{id}});
  if(!user){
    throw new NotFoundException('User not found');
  }
  return this.prisma.user.delete({where:{id}});
 }

 //update user details
 async updateUser(id:string,data:Partial<User>){
  const user=await this.prisma.user.findUnique({where:{id}});
  if(!user) throw new NotFoundException('User not found');

  return this.prisma.user.update({
    where:{id},
    data,
  })
 }

 //get payment details
   async getAllPayments(){
    return this.prisma.payment.findMany({
      select:{
        id:true,
        razorpayOrderId:true,
        razorpayPaymentId:true,
       razorpaySignature:true,
       email:true,
       amount:true,
       createdAt:true,
      }
    })
  }
}