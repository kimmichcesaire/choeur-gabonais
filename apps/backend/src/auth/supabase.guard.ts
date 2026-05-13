import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { SupabaseService } from '../common/supabase/supabase.service'

@Injectable()
export class SupabaseGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseGuard.name)

  constructor(private supabase: SupabaseService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req   = ctx.switchToHttp().getRequest<{ headers: Record<string, string>; user: unknown; ip: string }>()
    const token = req.headers['authorization']?.replace('Bearer ', '').trim()

    if (!token) {
      this.logger.warn(`Tentative d'accès sans token — IP: ${req.ip}`)
      throw new UnauthorizedException('Token manquant')
    }

    const { data: { user }, error } = await this.supabase.public.auth.getUser(token)

    if (error || !user) {
      this.logger.warn(`Échec d'authentification — IP: ${req.ip} — ${error?.message ?? 'utilisateur introuvable'}`)
      throw new UnauthorizedException('Token invalide ou expiré')
    }

    req.user = user
    return true
  }
}
