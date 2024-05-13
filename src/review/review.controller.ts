import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {JwtAuthGuard} from '../guards/auth.guard';
import {Request, Response} from 'express';
import {CreateReviewDto} from '../review/dto/create-review.dto';
import {ReviewService} from '../review/review.service';

import {Roles} from '../decorator/roles.decorator';
import {RolesGuard} from '../guards/roles.guard';
import {
    ApiConsumes,
    ApiCookieAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {Review} from '../entity/review.entity';
import {ValidationPipe} from '../pipe/validation.pipe';
import {message} from '../constants/constants';
import {Role} from '../enums/role.enum';

@Controller('review')
export class ReviewController {
    constructor(private reviewService: ReviewService) {
    }

    @ApiTags('Review')
    @ApiOperation({summary: 'Get paginated reviews'})
    @ApiNotFoundResponse({description: message.NOT_FOUND})
    @ApiQuery({name: 'page', required: false, description: 'Default value:1'})
    @ApiQuery({name: 'size', required: false, description: 'Default value:5'})
    @ApiOkResponse({type: [Review]})
    @Get(':recordID')
    getRecordReviews(
        @Param('recordID') recordID: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 5,
    ) {
        const filters = {page, size};

        return this.reviewService.getRecordReviews(recordID, filters);
    }

    @ApiTags('Review')
    @ApiCookieAuth()
    @ApiOperation({summary: 'Create review'})
    @ApiOkResponse({type: [Review]})
    @ApiUnauthorizedResponse({description: message.UNAUTHORIZED})
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    @Post(':recordID')
    createReview(
        @Req() req: Request,
        @Param('recordID') recordID: string,
        @Body(new ValidationPipe()) dto: CreateReviewDto,
    ) {
        return this.reviewService.createReview(req.userID, recordID, dto);
    }

    @ApiTags('Admin')
    @ApiCookieAuth()
    @ApiOperation({summary: 'Delete review'})
    @ApiOkResponse({description: message.SUCCESS})
    @ApiForbiddenResponse({description: message.FORBIDDEN})
    @ApiUnauthorizedResponse({description: message.UNAUTHORIZED})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':recordID/:reviewID')
    async deleteReview(
        @Param('recordID') recordID: string,
        @Param('reviewID') reviewID: string,
        @Res() res: Response,
    ) {
        await this.reviewService.deleteReview(recordID, reviewID);
        res.end();
    }
}
