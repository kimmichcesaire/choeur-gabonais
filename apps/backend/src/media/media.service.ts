import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { SupabaseService } from '../common/supabase/supabase.service'

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name)

  constructor(private supabase: SupabaseService) {}

  async findAll(type?: 'video' | 'audio') {
    let q = this.supabase.public.from('media').select('*').order('sort_order')
    if (type) q = q.eq('type', type)
    const { data, error } = await q
    if (error) {
      this.logger.error('Erreur lecture media', error.message)
      throw new InternalServerErrorException('Une erreur est survenue, veuillez réessayer.')
    }
    return data
  }
}
