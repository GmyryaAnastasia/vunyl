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
import { Status } from '../enums/status.enum';

@Entity()
export class Purchase extends BaseEntity {
  @ApiProperty({
    example: '0c9f11a8-4a1c-4716-850a-4c0f53f93392',
    description: 'Product ID within the order',
  })
  @Column({ primary: true, generated: 'uuid' })
    purchaseID: string;

  @ApiProperty({ description: 'User who create order' })
  @ManyToOne(() => User, (user) => user.purchase, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userID' })
    userID: string;

  @ApiProperty({ description: 'Bought record' })
  @ManyToOne(() => Record, (record) => record.customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recordID' })
    recordID: string;

  @ApiProperty({ example: '4' })
  @Column()
    amount: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

  @ApiProperty({
    example: 'pi_3PCe2IJ90t0l1Lkr1NpwCJH4',
    description: 'ID of total order',
  })
  @Column()
    orderNumber: string;
  @ApiProperty({
    example: 'pending',
    description: 'Order\'s status',
    enum: Status,
    enumName: 'Status',
    default: Status.PENDIND,
  })
  @Column('enum', { enum: Status, default: Status.PENDIND })
    orderStatus: string;
}
