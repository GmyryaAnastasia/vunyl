import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRecordDto {
  @ApiProperty({ description: 'Name (cannot be empty)' })
  @IsNotEmpty({ message: 'Name can\'t be empty' })
  readonly name: string;

  @ApiProperty({ description: 'Description (cannot be empty)' })
  @IsNotEmpty({ message: 'Description can\'t be empty' })
  readonly description: string;

  @ApiProperty({ description: 'Description (cannot be empty)' })
  @IsNotEmpty({ message: 'Description can\'t be empty' })
  readonly author_name: string;

  @ApiProperty({ description: 'Price (cannot be empty)' })
  @IsNotEmpty({ message: 'Price can\'t be empty' })
  readonly price: number;

  @ApiProperty({ type: 'string', format: 'binary' })
    image: Buffer;
}
