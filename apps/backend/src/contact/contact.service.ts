import { Injectable, Logger } from '@nestjs/common'
import { DatabaseService } from '../common/database/database.service'
import { MailerService } from '../mailer/mailer.service'
import { CreateContactDto } from './dto/create-contact.dto'
import type { ApiResponseSuccess } from '../common/types/api-response'

interface ContactMessage extends CreateContactDto {
  id: string
  created_at: string
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name)

  constructor(
    private database: DatabaseService,
    private mailer: MailerService,
  ) { }

  /**
   * Crée un nouveau message de contact
   */
  async create(dto: CreateContactDto): Promise<ApiResponseSuccess> {
    this.logger.log(`Nouveau message contact de ${dto.email}`)

    await this.database.insert('contact_messages', dto as unknown as Record<string, unknown>)

    try {
      await this.mailer.sendContactNotification(dto)
    } catch (err) {
      this.logger.error('Erreur envoi email notification', err)
    }

    return { success: true, message: 'Message reçu avec succès' }
  }

  /**
   * Récupère tous les messages de contact (admin)
   */
  async findAll(): Promise<ContactMessage[]> {
    return this.database.read<ContactMessage>('contact_messages', {
      order: { field: 'created_at', ascending: false },
    })
  }

  /**
   * Récupère un message spécifique
   */
  async findOne(id: string): Promise<ContactMessage | null> {
    return this.database.readOne<ContactMessage>('contact_messages', id)
  }
}
