import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { SupabaseService }      from '../common/supabase/supabase.service'
import { MailerService }        from '../mailer/mailer.service'
import { CreateApplicationDto } from './dto/create-application.dto'

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name)

  constructor(
    private supabase: SupabaseService,
    private mailer: MailerService,
  ) {}

  async apply(dto: CreateApplicationDto) {
    const { error } = await this.supabase.public
      .from('member_applications')
      .insert({ ...dto, status: 'pending' })
    if (error) {
      this.logger.error('Erreur insertion member_applications', error.message)
      throw new InternalServerErrorException('Une erreur est survenue, veuillez réessayer.')
    }
    await this.mailer.sendCandidatureNotification(dto)
    return { success: true }
  }

  async findAll() {
    const client = this.supabase.admin ?? this.supabase.public
    const { data, error } = await client
      .from('member_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      this.logger.error('Erreur lecture member_applications', error.message)
      throw new InternalServerErrorException('Une erreur est survenue, veuillez réessayer.')
    }
    return data
  }
}
