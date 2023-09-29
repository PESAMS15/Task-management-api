import {
  Body,
  Controller,
  Post,
  Get,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthCrediventialsDto } from './dto/auth-credientials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';

import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(
    @Body(ValidationPipe) AuthCrediventialsDto: AuthCrediventialsDto,
  ): Promise<User> {
    return this.authService.signup(AuthCrediventialsDto);
  }

  @Post('/signin')
  async signin(
    @Body(ValidationPipe) AuthCrediventialsDto: AuthCrediventialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.validateUserPassword(AuthCrediventialsDto);
  }
  @Post('/profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User) {
    console.log('user is ' + user);
    // return user;
  }

  @Post('/test')
  @UseGuards(AuthGuard(''))
  test(@Req() req) {
    console.log(req);
    return req.user;
  }
}
