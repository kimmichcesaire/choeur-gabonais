import { useState } from 'react'
import { api } from '../services/api'
import { useForm } from '../hooks/useForm'
import { SITE_CONFIG, FORM_MESSAGES } from '../utils/constants'
import type { VoiceType, CreateContactDto, CreateApplicationDto } from '@choeur/shared'

type FormTab = 'contact' | 'candidature'

/**
 * Champ piège invisible pour un humain, irrésistible pour un bot qui remplit
 * tous les champs d'un formulaire.
 */
function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
      <label htmlFor="website">Site web</label>
      <input
        type="text"
        id="website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default function ContactPage() {
  const [tab, setTab] = useState<FormTab>('contact')

  return (
    <>
      <div className="page-hero">
        <div className="section-tag">Contact</div>
        <h1>Nous contacter</h1>
        <p>Une question ? Envie de rejoindre le chœur ? Écrivez-nous !</p>
      </div>

      <section>
        <div className="media-tabs">
          <button
            className={`tab${tab === 'contact' ? ' active' : ''}`}
            onClick={() => setTab('contact')}
          >
            ✉️ Contact
          </button>
          <button
            className={`tab${tab === 'candidature' ? ' active' : ''}`}
            onClick={() => setTab('candidature')}
          >
            🎵 Candidature
          </button>
        </div>

        <div className="contact-grid">
          <div>
            {tab === 'contact' && <ContactForm />}
            {tab === 'candidature' && <CandidatureForm />}
          </div>
          <div className="contact-info-card">
            <h3>Nos coordonnées</h3>
            <div className="info-row">
              <span className="info-icon">📧</span>
              <span>{SITE_CONFIG.contact.email}</span>
            </div>
            <div className="info-row">
              <span className="info-icon">📍</span>
              <span>{SITE_CONFIG.contact.location}</span>
            </div>
            <div className="info-row">
              <span className="info-icon">🕐</span>
              <span>
                Répétition un week-end tous les trois (3) mois 
               
              </span>
            </div>
            <div className="info-row">
              <span className="info-icon">🎵</span>
              <span>Toutes les voix sont bienvenues !</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * Formulaire de contact
 */
function ContactForm() {
  const [honeypot, setHoneypot] = useState('')
  const form = useForm<CreateContactDto>({
    initialValues: {
      full_name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: async (values) => {
      if (honeypot) return
      await api.submitContact(values, honeypot)
    },
  })

  if (form.isSuccess) {
    return (
      <div className="form-success">{FORM_MESSAGES.success.contactSubmitted}</div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit}>
      <h3 style={{ marginBottom: 20, fontSize: '1.2rem', fontWeight: 700 }}>
        Envoyer un message
      </h3>
      {form.isError && (
        <div className="form-error">{form.error}</div>
      )}
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="form-group">
        <label>Nom complet *</label>
        <input
          required
          value={form.values.full_name}
          onChange={form.setField('full_name')}
          placeholder="Nom complet"
        />
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input
          required
          type="email"
          value={form.values.email}
          onChange={form.setField('email')}
          placeholder="ac@gmail.com"
        />
      </div>
      <div className="form-group">
        <label>Sujet</label>
        <input
          value={form.values.subject}
          onChange={form.setField('subject')}
          placeholder="Votre sujet"
        />
      </div>
      <div className="form-group">
        <label>Message *</label>
        <textarea
          required
          value={form.values.message}
          onChange={form.setField('message')}
          placeholder="Votre message…"
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
        disabled={form.isLoading}
      >
        {form.isLoading ? FORM_MESSAGES.loading.sending : 'Envoyer le message'}
      </button>
    </form>
  )
}

/**
 * Formulaire de candidature
 */
function CandidatureForm() {
  const [honeypot, setHoneypot] = useState('')
  const form = useForm<CreateApplicationDto>({
    initialValues: {
      full_name: '',
      email: '',
      phone: '',
      voice_type: undefined,
      experience: '',
      motivation: '',
    },
    onSubmit: async (values) => {
      if (honeypot) return
      if (!values.voice_type) {
        throw new Error('Veuillez sélectionner votre tessiture.')
      }
      await api.submitApplication(values as CreateApplicationDto, honeypot)
    },
  })

  const voiceTypes: Array<{ value: VoiceType; label: string }> = [
    { value: 'soprano', label: 'Soprano' },
    { value: 'alto', label: 'Alto' },
    { value: 'tenor', label: 'Ténor' },
    { value: 'basse', label: 'Basse' },
  ]

  if (form.isSuccess) {
    return (
      <div className="form-success">{FORM_MESSAGES.success.applicationSubmitted}</div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit}>
      <h3 style={{ marginBottom: 20, fontSize: '1.2rem', fontWeight: 700 }}>
        Candidature
      </h3>
      {form.isError && (
        <div className="form-error">{form.error}</div>
      )}
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="form-group">
        <label>Nom complet *</label>
        <input
          required
          value={form.values.full_name}
          onChange={form.setField('full_name')}
          placeholder="Votre nom"
        />
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input
          required
          type="email"
          value={form.values.email}
          onChange={form.setField('email')}
          placeholder="ac@email.com"
        />
      </div>
      <div className="form-group">
        <label>Téléphone *</label>
        <input
          required
          type="tel"
          value={form.values.phone}
          onChange={form.setField('phone')}
          placeholder="+33 6 12 34 56 78"
        />
      </div>
      <div className="form-group">
        <label>Pupitre *</label>
        <select
          required
          value={form.values.voice_type ?? ''}
          onChange={form.setField('voice_type')}
        >
          <option value="">Sélectionnez votre Pupitre</option>
          {voiceTypes.map((vt) => (
            <option key={vt.value} value={vt.value}>
              {vt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Expérience musicale</label>
        <textarea
          value={form.values.experience}
          onChange={form.setField('experience')}
          placeholder="Décrivez votre expérience musicale…"
        />
      </div>
      <div className="form-group">
        <label>Motivation *</label>
        <textarea
          required
          value={form.values.motivation}
          onChange={form.setField('motivation')}
          placeholder="Pourquoi souhaitez-vous rejoindre le chœur ?"
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
        disabled={form.isLoading}
      >
        {form.isLoading ? FORM_MESSAGES.loading.sending : 'Envoyer candidature'}
      </button>
    </form>
  )
}
