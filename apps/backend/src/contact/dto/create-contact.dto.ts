import { IsString, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateContactDto {
  @IsString() @MinLength(2) @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  full_name: string

  @IsEmail() @MaxLength(254)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string

  @IsOptional() @IsString() @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  subject?: string

  @IsString() @MinLength(10) @MaxLength(5000)
  @Transform(({ value }) => value?.trim())
  message: string
}
