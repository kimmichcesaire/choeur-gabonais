import { Global, Module } from '@nestjs/common'
import { SupabaseGuard } from './supabase.guard'
import { AdminGuard } from './admin.guard'

@Global()
@Module({ providers: [SupabaseGuard, AdminGuard], exports: [SupabaseGuard, AdminGuard] })
export class AuthModule {}
