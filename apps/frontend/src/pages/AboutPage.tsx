import { useState, useEffect } from 'react'
import type { TeamMember } from '@choeur/shared'
import { supabaseService, SupabaseServiceError } from '../services/supabaseService'

export default function AboutPage() {
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
            Fondé en 2020, le Chœur Gabonais de France réunit des choristes
            passionnés par la musique gabonaise et africaine. Notre mission :
            promouvoir la richesse musicale et culturelle du Gabon en France, à
            travers des concerts, des ateliers et des collaborations artistiques.
          </p>
        </div>
      </section>

      <section>
        <div className="section-header">
          <div className="section-tag">L'équipe</div>
          <h2>Les membres</h2>
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