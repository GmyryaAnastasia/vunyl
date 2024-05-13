import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { Record } from '../entity/record.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review extends BaseEntity {
  @ApiProperty({
    example: '0c8f11a8-4a1c-4716-850a-4c0f53f93392',
    description: 'Review  id',
  })
  @Column({ primary: true, generated: 'uuid' })
    reviewID: string;

  @ApiProperty({ description: 'User who left review' })
  @ManyToOne(() => User, (user) => user.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userID' })
    userID: string;

  @ApiProperty({ description: 'Record to which the comment applies' })
  @ManyToOne(() => Record, (record) => record.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recordID' })
    recordID: string;

  @ApiProperty({ example: 'Any comment' })
  @Column({ nullable: false })
    comment: string;

  @ApiProperty({ example: '4', minimum: 0, maximum: 5 })
  @Column()
    user_score: number;

  @ApiProperty({ example: '2024-05-06 16:20:41' })
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
