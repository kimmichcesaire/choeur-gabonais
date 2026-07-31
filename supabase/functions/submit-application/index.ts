import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADMIN_EMAIL = 'neybernal99@gmail.com'
const CHOIR_NAME = 'Chœur Gabonais de France'

const VOICE_LABELS: Record<string, string> = {
  soprano: 'Soprano',
  alto: 'Alto',
  tenor: 'Ténor',
  basse: 'Basse',
  autre: 'Autre',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { full_name, email, phone, voice_type, experience, motivation, website } = await req.json()

    // Honeypot : un bot remplit ce champ invisible pour un humain — on fait
    // semblant que ça a marché sans rien enregistrer ni envoyer d'email.
    if (website) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!full_name || !email || !motivation) {
      return new Response(JSON.stringify({ error: 'Champs obligatoires manquants' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Sauvegarde en base de données
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error: dbError } = await supabase.from('member_applications').insert({
      full_name,
      email,
      phone: phone || null,
      voice_type: voice_type || null,
      experience: experience || null,
      motivation,
    })

    if (dbError) throw dbError

    const voiceLabel = voice_type ? (VOICE_LABELS[voice_type] ?? voice_type) : '(non renseignée)'

    // Notification admin via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [ADMIN_EMAIL],
          subject: `[${CHOIR_NAME}] Nouvelle candidature — ${full_name}`,
          html: `
            <h2>Nouvelle candidature reçue</h2>
            <p><strong>Nom :</strong> ${full_name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone || '(non renseigné)'}</p>
            <p><strong>Tessiture :</strong> ${voiceLabel}</p>
            <p><strong>Expérience musicale :</strong></p>
            <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">
              ${experience ? experience.replace(/\n/g, '<br>') : '(non renseignée)'}
            </blockquote>
            <p><strong>Motivation :</strong></p>
            <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">
              ${motivation.replace(/\n/g, '<br>')}
            </blockquote>
          `,
        }),
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (_err) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
