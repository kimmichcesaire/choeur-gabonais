import { useState, useEffect } from 'react'
import type { TeamMember } from '@choeur/shared'
import { supabaseService, SupabaseServiceError } from '../services/supabaseService'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AboutPage() {
  usePageMeta(
    'À propos — Chœur Gabonais de France',
    "Découvrez l'histoire, les valeurs et l'équipe du Chœur Gabonais de France, association culturelle fondée en 2020 pour promouvoir la culture gabonaise par le chant choral.",
  )
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await supabaseService.read<TeamMember>('team_members', {
          filter: { is_active: true },
          order: { field: 'sort_order', ascending: true },
        })
        setTeam(data)
        setError(null)
      } catch (err) {
        const errorMsg =
          err instanceof SupabaseServiceError
            ? err.message
            : 'Impossible de charger l\'équipe. Veuillez réessayer.'
        setError(errorMsg)
        setTeam([])
      } finally {
        setLoading(false)
      }
    }

    loadTeam()
  }, [])

  return (
    <div className="about-page-bg">
      <div className="page-hero-about">
        <div className="section-tag">Notre équipe</div>
        <h1>À propos</h1>
        <p>
          Découvrez les hommes et les femmes qui font vivre le Chœur Gabonais de
          France.
        </p>
        <div className="about-photos-grid">
          <div className="about-photo-wrap">
            <img src="/p2.jpg" alt="Le chœur en répétition" className="about-photo" />
          </div>
          <div className="about-photo-wrap">
            <img src="/p3.jpg" alt="Le chœur sur scène" className="about-photo" />
          </div>
        </div>
      </div>

      <section>
        <div className="section-header">
          <div className="section-tag">Qui sommes-nous</div>
          <h2>Notre histoire</h2>
          <p>
            Le Choeur Gabonais de France (CGDF), est une association a but non lucratif régie par la loi du 1er Juillet 1901 et le décret du 16 aout de la même année. Fondée le 15 mai 2020, le Choeur Gabonaisde France a pour objectif de promouvoir la culture gabonaise par le chant choral.
            <br />A travers l’interprétation de chants issus de styles musicaux variés, les membres du CGDF souhaitent transporter le public dans un univers rythmé aux influences gabonaises en particulier et africaines engénéral.
          </p> <br /> <br /><br />

          <h2>Nos valeurs</h2>
          <p>
            Partage <br />
            Amour <br />
            Diversité et
            faire découvrir la culture
            musique gabonaise <br />
            Représenter valablement
            le Gabon en France
          </p>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div className="section-tag">Objectif</div>
          <h2>Nos missions</h2>
          <p>
            Le Choeur Gabonais de
            France a pour mission
            de célébrer et
            promouvoir la richesse
            de la musique
            gabonaise et est la voix
            vivante de la culture
            gabonaise en France
          </p>
        </div>

        {loading && <div className="loader">Chargement…</div>}

        {error && (
          <div className="error-msg">
            Erreur : {error}
          </div>
        )}

        {!loading && !error && team.length === 0 && (
          <div className="empty">
            <p>Aucun membre de l'équipe disponible pour le moment.</p>
          </div>
        )}

        {!loading && !error && team.length > 0 && (
          <div className="team-grid">
            {team.map((m) => (
              <div className="team-card" key={m.id}>
                {m.photo_url ? (
                  <img
                    className="team-photo"
                    src={m.photo_url}
                    alt={m.full_name}
                  />
                ) : (
                  <div className="team-photo-placeholder">
                    <span>📸</span>
                  </div>
                )}
                <div className="team-card-body">
                  <h3>{m.full_name}</h3>
                  {m.role && <p className="team-role">{m.role}</p>}
                  {m.bio && <p className="team-bio">{m.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}