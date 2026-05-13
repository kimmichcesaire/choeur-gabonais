import { IsString, IsOptional, IsBoolean, IsDateString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateEventDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  title?: string

  @IsOptional() @IsString() @MaxLength(2000)
  @Transform(({ value }) => value?.trim())
  description?: string

  @IsOptional() @IsDateString()
  date?: string

  @IsOptional() @IsString() @MaxLength(300)
  @Transform(({ value }) => value?.trim())
  location?: string

  @IsOptional() @IsUrl({ protocols: ['https'], require_protocol: true }, { message: 'image_url doit être une URL HTTPS valide' })
  @MaxLength(500)
  image_url?: string

  @IsOptional() @IsBoolean()
  is_featured?: boolean
}
