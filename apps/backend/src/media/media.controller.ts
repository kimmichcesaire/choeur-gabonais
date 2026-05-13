import { Controller, Get, Query } from '@nestjs/common'
import { MediaService } from './media.service'

@Controller('media')
export class MediaController {
  constructor(private readonly svc: MediaService) {}

  @Get()
  findAll(@Query('type') type?: 'video' | 'audio') {
    return this.svc.findAll(type)
  }
}
