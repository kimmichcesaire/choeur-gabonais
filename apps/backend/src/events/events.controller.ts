import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { EventsService }  from './events.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { AdminGuard }     from '../auth/admin.guard'

@Controller('events')
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  @Get()
  findAll(
    @Query('featured') featured?: string,
    @Query('upcoming') upcoming?: string,
  ) {
    return this.svc.findAll({ featured: featured === 'true', upcoming: upcoming === 'true' })
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id) }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateEventDto) { return this.svc.create(dto) }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) { return this.svc.update(id, dto) }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) { return this.svc.remove(id) }
}
