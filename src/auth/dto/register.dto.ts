import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf
} from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(11)
  name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(11)
  surname: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  have_company: boolean;

  @ValidateIf(o => o.have_company === true)
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name_company: string;

  @ValidateIf(o => o.have_company === true)
  @IsString()
  @MinLength(11)
  @MaxLength(11)
  ruc_company: string;

  @ValidateIf(o => o.have_company === true)
  @IsString()
  @MinLength(9)
  @MaxLength(15)
  phone_company: string;
}

