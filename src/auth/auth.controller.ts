import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleGuard } from '../guards/google.guard';
import { AuthService } from '../auth/auth.service';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/auth.guard';
import { message } from '../constants/constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'Redirect to "google/login"' })
  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth(@Req() req: Request) {}

  @ApiOperation({ summary: 'Google authentication redirect' })
  @ApiOkResponse({ description: message.SUCCESS })
  @Get('google/login')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    res.cookie('token', token.access_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: '/',
    });

    return res.redirect('http://localhost:3000/user/profile');
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: message.SUCCESS })
  @ApiUnauthorizedResponse({ description: message.UNAUTHORIZED })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token').end();
  }
}
