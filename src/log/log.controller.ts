import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from '../log/log.service';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Log } from '../entity/log.entity';
import { message } from '../constants/constants';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { Role } from '../enums/role.enum';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}

  @ApiOperation({ summary: 'Get log' })
  @ApiCookieAuth()
  @ApiForbiddenResponse({ description: message.FORBIDDEN })
  @ApiOkResponse({ type: [Log] })
  @ApiUnauthorizedResponse({ description: message.UNAUTHORIZED })
  @Get()
  getLog() {
    return this.logService.getLog();
  }
}
