import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { Review } from '../entity/review.entity';
import { Purchase } from '../entity/purchase.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    example: '0c4f11a8-4a1c-4716-850a-4c0f53f93392',
    description: 'Unique user id',
  })
  @Column({ primary: true, generated: 'uuid' })
    id: string;

  @ApiProperty({ example: 'FirstName', description: 'FirstName of the user' })
  @Column({ nullable: false })
    firstName: string;

  @ApiProperty({ example: 'LastName', description: 'LastName of the user' })
  @Column({ nullable: false })
    lastName: string;

  @ApiProperty({ example: 'user@email.com', description: 'Email address' })
  @Column({
    unique: true,
    nullable: false,
  })
    email: string;

  @ApiProperty({
    example: 'https://user-images.net',
    description: 'User\'s avatar',
    type: String,
  })
  @Column('blob')
    picture: Buffer;

  @ApiPropertyOptional({
    example: '2024-05-09',
    description: 'User\'s birthDate',
  })
  @Column('date', { nullable: true })
    birthDate: Date;

  @ApiProperty({
    example: 'user',
    description: 'User\'s role',
    enum: Role,
    enumName: 'Role',
    default: Role.USER,
  })
  @Column('enum', { enum: Role, default: Role.USER })
    role: Role;

  @ApiPropertyOptional({
    type: () => Review,
    isArray: true,
    description: 'Reviews created by the user',
  })
  @OneToMany(() => Review, (review) => review.userID, { cascade: true })
    review: Review[];

  @ApiPropertyOptional({
    type: () => Purchase,
    isArray: true,
    description: 'Purchases created by the user',
  })
  @OneToMany(() => Purchase, (purchase) => purchase.userID, { cascade: true })
    purchase: Purchase[];
}
