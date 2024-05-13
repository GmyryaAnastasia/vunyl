import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RecordService } from '../record/record.service';
import { CreateRecordDto } from '../record/dto/create-record.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateRecordDto } from '../record/dto/update-record.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Record } from '../entity/record.entity';
import { JwtAuthGuard } from '../guards/auth.guard';
import { ValidationPipe } from '../pipe/validation.pipe';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { Response } from 'express';
import { message } from '../constants/constants';
import { Role } from '../enums/role.enum';

@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @ApiTags('Record')
  @ApiOperation({ summary: 'Get paginated vinyl list' })
  @ApiOkResponse({ type: [Record] })
  @ApiQuery({ name: 'page', required: false, description: 'Default value:1' })
  @ApiQuery({ name: 'size', required: false, description: 'Default value:2' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Filter' })
  @ApiQuery({
    name: 'direction',
    required: false,
    description: 'Direction of sorting: "ASC" | "DESC"',
  })
  @ApiQuery({ name: 'searchTerm', required: false, description: 'Search' })
  @Get()
  getVinylList(
    @Query('page') page: number = 1,
    @Query('size') size: number = 2,
    @Query('sortBy') sortBy: string = 'name',
    @Query('direction') direction: 'ASC' | 'DESC' = 'ASC',
    @Query('searchTerm') searchTerm: string,
  ) {
    const filters = { page, size, sortBy, direction, searchTerm };

    return this.recordService.getVinylList(filters);
  }

  @ApiTags('Admin')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create record' })
  @ApiOkResponse({ type: [Record] })
  @ApiForbiddenResponse({ description: message.FORBIDDEN })
  @ApiUnauthorizedResponse({ description: message.UNAUTHORIZED })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateRecordDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createRecord(
    @Body(new ValidationPipe()) dto: CreateRecordDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.recordService.createRecord(dto, file);
  }
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Update record' })
  @ApiCookieAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateRecordDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':recordID')
  @UseInterceptors(FileInterceptor('image'))
  async updateRecord(
    @Param('recordID') recordID: string,
    @Body() dto: UpdateRecordDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    await this.recordService.updateRecord(recordID, dto, file);
    res.end();
  }

  @ApiTags('Admin')
  @ApiOperation({ summary: 'Delete record' })
  @ApiCookieAuth()
  @ApiForbiddenResponse({ description: message.FORBIDDEN })
  @ApiOkResponse({ description: message.SUCCESS })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':recordID')
  async deleteRecord(
    @Param('recordID') recordID: string,
    @Res() res: Response,
  ) {
    await this.recordService.deleteRecord(recordID);
    res.end();
  }
}
