import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from '../guards/auth.guard';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidationPipe } from '../pipe/validation.pipe';
import { message } from '../constants/constants';

@ApiTags('User')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: message.UNAUTHORIZED })
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ type: [User] })
  @ApiNotFoundResponse({ description: message.NOT_FOUND })
  @Get('/profile')
  getUserProfile(@Req() req: Request) {
    return this.userService.getUserProfile(req.userID);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ description: message.SUCCESS })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @Patch('/profile')
  @UseInterceptors(FileInterceptor('picture'))
  async updateProfile(
    @Req() req: Request,
    @Body(new ValidationPipe()) dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    await this.userService.updateProfile(req.userID, dto, file);
    res.end();
  }

  @ApiOperation({ summary: 'Delete user profile' })
  @ApiOkResponse({ description: message.SUCCESS })
  @Delete('/profile')
  async deleteProfile(@Req() req: Request, @Res() res: Response) {
    await this.userService.deleteProfile(req.userID);
    res.clearCookie('token');
  }
}
