import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'recordID (cannot be empty)' })
  @IsNotEmpty({ message: 'recordID cannot be empty' })
  readonly recordID: string;

  @ApiProperty({ description: 'Amount (cannot be empty)', type: Number })
  @IsInt()
  readonly amount: number;

  @ApiProperty({ description: 'Price (cannot be empty)', type: Number })
  @IsInt()
  readonly price: number;
}
