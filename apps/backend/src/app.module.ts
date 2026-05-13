import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD, APP_PIPE, APP_FILTER } from '@nestjs/core'
import { SupabaseModule } from './common/supabase/supabase.module'
import { DatabaseModule } from './common/database/database.module'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { MailerModule } from './mailer/mailer.module'
import { EventsModule } from './events/events.module'
import { MediaModule } from './media/media.module'
import { MembersModule } from './members/members.module'
import { ContactModule } from './contact/contact.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 60_000, limit: 10 },
      { name: 'long', ttl: 3_600_000, limit: 50 },
    ]),
    SupabaseModule,
    DatabaseModule,
    MailerModule,
    EventsModule,
    MediaModule,
    MembersModule,
    ContactModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }) },
  ],
})
export class AppModule { }
