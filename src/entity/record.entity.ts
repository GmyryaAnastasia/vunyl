import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { Review } from '../entity/review.entity';
import { Purchase } from '../entity/purchase.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Record extends BaseEntity {
  @ApiProperty({
    example: '0c8f11a8-4a1c-4716-850a-4c0f53f93392',
    description: 'Unique record id',
  })
  @Column({ primary: true, generated: 'uuid' })
    recordID: string;

  @ApiProperty({ example: 'RecordName' })
  @Column({ nullable: false })
    name: string;

  @ApiProperty({ example: 'AuthorName' })
  @Column({ nullable: false })
    author_name: string;

  @ApiProperty({ example: 'Аny record description' })
  @Column({ nullable: false })
    description: string;

  @ApiProperty({ example: '20' })
  @Column('decimal', { nullable: false })
    price: number;

  @ApiProperty({ example: 'https://record-images.net', type: String })
  @Column('blob', { nullable: false })
    image: Buffer;

  @ApiProperty({ example: '4', description: 'Аverage rating of all users' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    score: number;

  @ApiPropertyOptional({
    type: () => Review,
    isArray: true,
    description: 'Reviews of this record',
  })
  @OneToMany(() => Review, (review) => review.recordID)
    review: Review[];

  @OneToMany(() => Purchase, (purchase) => purchase.recordID)
    customer: Purchase[];
}
