import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import ROLE from '../../shared/role';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsStrongPassword({
    minLength: 6,
  })
  password: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString({ each: true })
  @IsEnum(ROLE)
  role: ROLE;
}
