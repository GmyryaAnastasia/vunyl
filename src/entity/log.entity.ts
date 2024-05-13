import { BaseEntity, Column, CreateDateColumn, Entity } from 'typeorm';
import { Action } from '../enums/action.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Log extends BaseEntity {
  @ApiProperty({
    example: '0c6611a8-4a1c-4716-850a-4c0f53f93392',
    description: 'Unique action id',
  })
  @Column({ primary: true, generated: 'uuid' })
    logID: string;

  @ApiProperty({ example: 'create', enum: Action, enumName: 'Action' })
  @Column('enum', { enum: Action })
    action: Action;

  @ApiProperty({ example: 'user', description: 'Name of entity' })
  @Column({ nullable: false })
    entity: string;

  @ApiProperty({ example: '4c11a8-4a1c-4716-850a-4c0f53f93392' })
  @Column({ nullable: false })
    entityID: string;

  @ApiPropertyOptional({ example: 'Update name' })
  @Column({ nullable: true })
    details: string;

  @ApiPropertyOptional({ example: '2024-05-04 10:22:50' })
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
