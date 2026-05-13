import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { MembersService }       from './members.service'
import { CreateApplicationDto } from './dto/create-application.dto'
import { AdminGuard }           from '../auth/admin.guard'

@Controller('members')
export class MembersController {
  constructor(private readonly svc: MembersService) {}

  // 2 candidatures max par heure par IP — anti-spam
  @Post('apply')
  @Throttle({ short: { limit: 2, ttl: 3_600_000 } })
  apply(@Body() dto: CreateApplicationDto) { return this.svc.apply(dto) }

  @Get()
  @UseGuards(AdminGuard)
  findAll() { return this.svc.findAll() }
}
