import {
  IsEmail,
  IsInt,
  IsString,
  IsStrongPassword,
  Min,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import ROLE from '../../shared/role';

@Entity()
export class User {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { length: 60 })
  @ApiProperty({
    description: 'name of user',
    required: true,
    example: 'Frank',
  })
  name: string;

  @IsEmail()
  @Column('varchar', { length: 100, unique: true })
  @ApiProperty({
    description: 'email of user',
    uniqueItems: true,
    required: true,
    example: 'user@coordinadora.com',
  })
  email: string;

  @IsStrongPassword()
  @Column('varchar', { length: 100 })
  @ApiProperty({
    description: 'password of user',
    required: true,
    example: 'my@strongPassword',
  })
  password: string;

  @Column({ type: 'enum', enum: ROLE })
  @ApiProperty({
    description: 'role of user',
    required: true,
    example: ROLE.ADMIN,
  })
  role: ROLE;
}
