import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { DatabaseService } from '../common/database/database.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'

interface EventRecord extends CreateEventDto {
  id: string
  created_at: string
  updated_at: string
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)

  constructor(private database: DatabaseService) { }

  async findAll(options: { featured?: boolean; upcoming?: boolean } = {}) {
    this.logger.debug(`Recherche événements: ${JSON.stringify(options)}`)

    const filter: Record<string, unknown> = {}
    if (options.featured) filter.is_featured = true
    if (options.upcoming) filter.is_past = false

    return this.database.read<EventRecord>('events', {
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      order: { field: 'date', ascending: true },
    })
  }

  async findOne(id: string): Promise<EventRecord> {
    const event = await this.database.readOne<EventRecord>('events', id)
    if (!event) {
      throw new NotFoundException(`Événement #${id} introuvable`)
    }
    return event
  }

  async create(dto: CreateEventDto): Promise<EventRecord> {
    this.logger.log(`Création événement: ${dto.title}`)
    return this.database.insert<EventRecord>('events', dto as unknown as Record<string, unknown>)
  }

  async update(id: string, dto: UpdateEventDto): Promise<EventRecord> {
    this.logger.log(`Mise à jour événement #${id}`)
    await this.findOne(id)
    return this.database.update<EventRecord>('events', id, dto)
  }

  async remove(id: string): Promise<{ success: boolean; deleted: string }> {
    this.logger.log(`Suppression événement #${id}`)
    await this.findOne(id)
    await this.database.delete('events', id)
    return { success: true, deleted: id }
  }
}
