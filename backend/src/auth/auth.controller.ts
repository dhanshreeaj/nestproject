import { Controller,Body,Post,Get,Req,UseGuards, Res, Query, HttpException, HttpStatus, Param, Delete, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response, } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body() body:{name:string;email:string;password:string}){
        return this.authService.register(body);
    }

  @Post('verify')
verify(@Body() body: { email: string; code: string }) {
  return this.authService.verifyEmail(body.email, body.code);
}

@Post('login')
login(@Body() body:{email:string;password:string}){
  return this.authService.login(body.email,body.password);
}

@Get('google')
  redirectToGoogle(@Res() res:Response){
    const url=this.authService.getGoogleOAuthUrl();
    res.redirect(url);
  }

  @Get('google/callback')
async googleCallback(@Query('code')code:string,@Res() res:Response){
  if(!code){
    throw new HttpException('Code is missing',HttpStatus.BAD_REQUEST);
  }
  return this.authService.handleGoogleCallback(code,res);
}

@Post('forgotpassword')
forgotPassword(@Body () body: {email:string}){
  return this.authService.forgotPassword(body.email);
}

@Post('resetpassword')
resetPassword(@Body() body:{email:string;code:string;newPassword:string}){
  return this.authService.resetPassword(body.email,body.code,body.newPassword);
}


@Get('users')
getAllUsers() {
  return this.authService.getAllUsers();
}

@Delete('users/:id')
deleteUser(@Param('id') id: string) {
  return this.authService.deleteUser(id);
}

@Patch('users/:id')
updateUsers(@Param('id') id:string,@Body() data:Partial<User>){
  return this.authService.updateUser(id,data)}

}