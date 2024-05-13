import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateRecordDto {
  @ApiPropertyOptional({ description: 'Name (cannot be empty)' })
  @IsNotEmpty({ message: 'Name can\'t be empty' })
  readonly name: string;

  @ApiPropertyOptional({ description: 'Description (cannot be empty)' })
  @IsNotEmpty({ message: 'Description can\'t be empty' })
  readonly description: string;

  @ApiPropertyOptional({ description: 'AuthorName (cannot be empty)' })
  @IsNotEmpty({ message: 'AuthorName can\'t be empty' })
  readonly author_name: string;

  @ApiPropertyOptional({ description: 'Price (cannot be empty)' })
  @IsNotEmpty({ message: 'Price can\'t be empty' })
  readonly price: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
    image: Buffer;
}
