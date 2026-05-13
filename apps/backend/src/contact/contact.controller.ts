import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ContactService } from './contact.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { AdminGuard } from '../auth/admin.guard'
import type { ApiResponse, ApiResponseSuccess } from '../common/types/api-response'

interface ContactMessage extends CreateContactDto {
  id: string
  created_at: string
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  // 3 messages max par heure par IP — anti-spam
  @Post()
  @Throttle({ short: { limit: 3, ttl: 3_600_000 } })
  async create(
    @Body() dto: CreateContactDto,
  ): Promise<ApiResponse<ApiResponseSuccess>> {
    const result = await this.contactService.create(dto)
    return { success: true, data: result }
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(): Promise<ApiResponse<ContactMessage[]>> {
    const data = await this.contactService.findAll()
    return { success: true, data }
  }
}
