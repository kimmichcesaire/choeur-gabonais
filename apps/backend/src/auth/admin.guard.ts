import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { SupabaseService } from '../common/supabase/supabase.service'

interface RequestWithUser {
  headers: Record<string, string>
  user: unknown
  ip: string
}

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name)

  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>()
    const token = req.headers['authorization']?.replace('Bearer ', '').trim()

    if (!token) {
      this.logger.warn(`Accès sans token — IP: ${req.ip}`)
      throw new UnauthorizedException('Token manquant')
    }

    const { data: { user }, error } = await this.supabase.public.auth.getUser(token)

    if (error || !user) {
      this.logger.warn(`Token invalide — IP: ${req.ip}`)
      throw new UnauthorizedException('Token invalide ou expiré')
    }

    const role = (user.app_metadata as Record<string, unknown>)?.role
    if (role !== 'admin') {
      this.logger.warn(`Accès admin refusé — user: ${user.id} — IP: ${req.ip}`)
      throw new ForbiddenException('Accès réservé aux administrateurs')
    }

    req.user = user
    return true
  }
}
