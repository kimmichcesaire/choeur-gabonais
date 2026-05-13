import { IsString, IsEmail, IsOptional, IsIn, MaxLength, MinLength, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

const VOICE_TYPES = ['soprano','mezzo-soprano','alto','tenor','baryton','basse','autre'] as const

export class CreateApplicationDto {
  @IsString() @MinLength(2) @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  full_name: string

  @IsEmail() @MaxLength(254)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string

  @IsOptional() @IsString() @MaxLength(20)
  @Matches(/^[+\d\s\-().]*$/, { message: 'Numéro de téléphone invalide' })
  @Transform(({ value }) => value?.trim())
  phone?: string

  @IsOptional() @IsIn(VOICE_TYPES)
  voice_type?: string

  @IsOptional() @IsString() @MaxLength(1000)
  @Transform(({ value }) => value?.trim())
  experience?: string

  @IsOptional() @IsString() @MaxLength(2000)
  @Transform(({ value }) => value?.trim())
  motivation?: string
}
