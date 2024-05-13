import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { type } = metadata;

    if (type !== 'body') {
      return value;
    }
    const obj = plainToInstance(metadata.metatype, value);
    const errors: ValidationError[] = await validate(obj);
    if (errors.length > 0) {
      const message: string = errors
        .map((err) => {
          return `${err.property}:${Object.values(err.constraints)}. `;
        })
        .join('');
      throw new BadRequestException(message);
    }

    return value;
  }
}
