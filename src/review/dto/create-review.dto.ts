import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Comment (cannot be empty)' })
  @IsNotEmpty({ message: 'Comment can\'t be empty' })
  readonly comment: string;

  @ApiProperty({ description: 'Score (cannot be empty)' })
  @IsInt()
  @Min(0)
  @Max(5)
  readonly user_score: number;
}
