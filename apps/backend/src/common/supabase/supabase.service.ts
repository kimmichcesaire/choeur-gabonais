import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { ConfigService }                    from '@nestjs/config'
import { createClient, SupabaseClient }     from '@supabase/supabase-js'

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name)

  public!: SupabaseClient
  admin: SupabaseClient | null = null

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const url     = this.config.getOrThrow<string>('SUPABASE_URL')
    const anonKey = this.config.getOrThrow<string>('SUPABASE_ANON_KEY')

    this.public = createClient(url, anonKey)

    const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')
    if (serviceKey && serviceKey !== 'YOUR_SERVICE_ROLE_KEY_HERE') {
      this.admin = createClient(url, serviceKey)
      this.logger.log('Client admin Supabase initialisé')
    } else {
      this.logger.warn('SUPABASE_SERVICE_ROLE_KEY non configurée — routes admin désactivées')
    }
  }
}
