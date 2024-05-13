import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMimeType, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'First name (cannot be empty)' })
  @IsNotEmpty({ message: 'First name can\'t be empty' })
    firstName: string;

  @ApiPropertyOptional({ description: 'Last name (cannot be empty)' })
  @IsNotEmpty({ message: 'Last name can\'t be empty' })
    lastName: string;

  @ApiPropertyOptional()
    birthDate: Date;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
    picture: Buffer;
}
