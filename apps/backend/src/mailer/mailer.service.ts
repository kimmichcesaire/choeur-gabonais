import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { CreateApplicationDto } from '../members/dto/create-application.dto'
import { CreateContactDto } from '../contact/dto/create-contact.dto'

function escapeHtml(str: string | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name)
  private readonly resend: Resend
  private readonly adminEmail: string
  private readonly from: string

  constructor(config: ConfigService) {
    this.resend = new Resend(config.get('RESEND_API_KEY'))
    this.adminEmail = config.get('ADMIN_EMAIL', 'neybernal99@gmail.com')
    this.from = config.get('MAILER_FROM', 'Choeur Gabonais <onboarding@resend.dev>')
  }

  async sendCandidatureNotification(dto: CreateApplicationDto): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [this.adminEmail],
      subject: ` Nouvelle candidature – ${dto.full_name}`,
      html: this.candidatureHtml(dto),
    })
    if (error) {
      this.logger.error(`Email candidature non envoyé [${error.name}] ${error.message}`)
      throw new Error(`Échec de l'envoi de l'email : ${error.message}`)
    }
  }

  async sendContactNotification(dto: CreateContactDto): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [this.adminEmail],
      subject: ` Nouveau message – ${dto.subject ?? 'Sans objet'}`,
      html: this.contactHtml(dto),
    })
    if (error) {
      this.logger.error(`Email contact non envoyé [${error.name}] ${error.message}`)
      throw new Error(`Échec de l'envoi de l'email : ${error.message}`)
    }
  }

  private candidatureHtml(dto: CreateApplicationDto): string {
    const voiceLabel: Record<string, string> = {
      soprano: 'Soprano', alto: 'Alto',
      tenor: 'Ténor', basse: 'Basse', autre: 'Autre',
    }
    const row = (label: string, value?: string) =>
      value ? `<tr>
        <td style="padding:8px 0;color:#555;width:160px;font-weight:bold;vertical-align:top">${label}</td>
        <td style="padding:8px 0;color:#111">${escapeHtml(value)}</td>
      </tr>` : ''

    const safeEmail = escapeHtml(dto.email)
    const safeVoice = dto.voice_type ? (voiceLabel[dto.voice_type] ?? escapeHtml(dto.voice_type)) : undefined

    return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#1a472a;padding:24px;border-radius:8px 8px 0 0">
    <h1 style="color:#fff;margin:0;font-size:22px"> Nouvelle candidature</h1>
    <p style="color:#a0cfb0;margin:4px 0 0">Choeur Gabonais de France</p>
  </div>
  <div style="background:#f9f9f9;padding:24px;border:1px solid #e0e0e0;border-top:none">
    <table style="width:100%;border-collapse:collapse">
      ${row('Nom complet', dto.full_name)}
      <tr>
        <td style="padding:8px 0;color:#555;width:160px;font-weight:bold">Email</td>
        <td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#1a472a">${safeEmail}</a></td>
      </tr>
      ${row('Téléphone', dto.phone)}
      ${row('Type de voix', safeVoice)}
      ${row('Expérience', dto.experience)}
      ${row('Motivation', dto.motivation)}
    </table>
  </div>
  <div style="padding:16px 24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;text-align:center">
    <p style="color:#888;font-size:12px;margin:0">Candidature reçue sur le site du Choeur Gabonais De France ( CGDF) </p>
  </div>
</div>`
  }

  private contactHtml(dto: CreateContactDto): string {
    const safeName = escapeHtml(dto.full_name)
    const safeEmail = escapeHtml(dto.email)
    const safeSubject = escapeHtml(dto.subject)
    const safeMessage = escapeHtml(dto.message)

    return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#1a472a;padding:24px;border-radius:8px 8px 0 0">
    <h1 style="color:#fff;margin:0;font-size:22px"> Nouveau message de contact</h1>
    <p style="color:#a0cfb0;margin:4px 0 0">Choeur Gabonais de France</p>
  </div>
  <div style="background:#f9f9f9;padding:24px;border:1px solid #e0e0e0;border-top:none">
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <tr>
        <td style="padding:8px 0;color:#555;width:120px;font-weight:bold">De</td>
        <td style="padding:8px 0;color:#111">${safeName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#555;font-weight:bold">Email</td>
        <td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#1a472a">${safeEmail}</a></td>
      </tr>
      ${safeSubject ? `<tr>
        <td style="padding:8px 0;color:#555;font-weight:bold">Sujet</td>
        <td style="padding:8px 0;color:#111">${safeSubject}</td>
      </tr>` : ''}
    </table>
    <div style="background:#fff;border-left:4px solid #1a472a;padding:12px 16px;border-radius:0 4px 4px 0">
      <p style="margin:0;color:#111;line-height:1.6;white-space:pre-wrap">${safeMessage}</p>
    </div>
  </div>
  <div style="padding:16px 24px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;text-align:center">
    <p style="color:#888;font-size:12px;margin:0">Message reçu sur le site du Choeur Gabonais de France</p>
  </div>
</div>`
  }
}
