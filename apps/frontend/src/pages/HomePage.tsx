import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useEvents } from '../hooks/useEvents'
import { useAppStore } from '../store/useAppStore'
import { formatters } from '../utils/formatters'
import {
  STATS,
  VALUES,
  GABON_FLAG_COLORS,
  ROUTES,
  FORM_MESSAGES,
} from '../utils/constants'

export default function HomePage() {
  const { events, loading } = useEvents({ upcoming: true })
  const loadSettings = useAppStore((s) => s.loadSettings)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const featured = events.filter((e) => e.is_featured).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-flags">
            <div
              className="flag-stripe"
              style={{ background: GABON_FLAG_COLORS.green }}
            />
            <div
              className="flag-stripe"
              style={{ background: GABON_FLAG_COLORS.yellow }}
            />
            <div
              className="flag-stripe"
              style={{ background: GABON_FLAG_COLORS.blue }}
            />
          </div>
          <div className="hero-badge">
            Association culturelle &amp; musicale
          </div>
          <h1>
            Chœur Gabonais
            <br />
            <span>de France</span>
          </h1>
          <p>
            Porteurs fiers du patrimoine musical gabonais, nous unissons nos voix
            pour célébrer la richesse culturelle du Gabon au cœur de la France.
          </p>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat-item" key={s.label}>
            <span className="stat-number">{s.number}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="about-grid">
          <div className="about-img-wrap">
            <video
              className="about-img"
              src="/A_la_decouverte_d_un_membre_du_cgdf.mp4"
              controls
              muted
              playsInline
            />
            <br />
            <br />
            <br />
            <br />
            <div className="about-badge">
              <span>♪</span>Depuis 2020
            </div>
          </div>
          <div className="about-text">
            <div className="section-tag">Mbolo - Samba</div>
            <h2>
              Une voix gabonaise
              <br />
              au cœur de la France
            </h2>
            <p>
              Le Chœur Gabonais de France est une association culturelle et
              musicale fondée par des passionnés de musique gabonaise installés
              en France.
            </p>
            <p>
              Réunissant des choristes de tous horizons autour d'un répertoire
              riche — chants traditionnels, musique contemporaine africaine —
              nous portons haut les couleurs du Gabon sur les scènes françaises.
            </p>
            <div className="values">
              {VALUES.map((v) => (
                <div className="value-item" key={v}>
                  <div className="value-dot" />
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS PREVIEW */}
      <section>
        <div className="section-header">
          <div className="section-tag">Agenda</div>
          <h2>Prochains événements</h2>
          <p>
            Retrouvez-nous lors de nos prestations, répétitions ouvertes et soirées
            culturelles.
          </p>
        </div>

        {loading && <div className="loader">{FORM_MESSAGES.loading.loading}</div>}

        {!loading && (
          <div className="events-grid">
            {(featured.length ? featured : events.slice(0, 3)).map((ev) => {
              const d = formatters.date(ev.date)
              return (
                <article className="event-card" key={ev.id}>
                  <div className="event-card-head">
                    <div className="event-date-chip">
                      <span className="day">{d.day}</span>
                      <span className="month">{d.month}</span>
                    </div>
                    <h3>{ev.title}</h3>
                  </div>
                  <div className="event-card-body">
                    <div className="event-meta">
                      <div className="event-meta-item">📅 {d.full}</div>
                      <div className="event-meta-item">🕐 {d.time}</div>
                      {ev.location && (
                        <div className="event-meta-item">📍 {ev.location}</div>
                      )}
                    </div>
                    {ev.description && <p>{ev.description}</p>}
                    <Link to={ROUTES.events} className="event-link">
                      En savoir plus →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && events.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to={ROUTES.events} className="btn-primary">
              Voir tous les événements
            </Link>
          </div>
        )}
      </section>

      {/* JOIN CTA */}
      <section className="join">
        <div className="section-header">
          <div className="section-tag">Rejoignez-nous</div>
          <h2>Votre voix nous manque</h2>
          <p>Vous aimez chanter et souhaitez contribuer au rayonnement de la culture gabonaise ? Toutes les voix sont bienvenues.</p>
        </div>
        <div className="join-actions">
          <Link to="/contact" className="btn-yellow">Déposer ma candidature</Link>
          <Link to="/contact" className="btn-outline">Nous contacter</Link>
        </div>
      </section>
    </>
  )
}
