import { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import { formatters } from '../utils/formatters'
import { FORM_MESSAGES } from '../utils/constants'

type Filter = 'all' | 'upcoming' | 'past'

const FILTERS = [
  { value: 'all' as Filter, label: 'Tous' },
  { value: 'upcoming' as Filter, label: 'À venir' },
  { value: 'past' as Filter, label: 'Passés' },
] as const

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const { events, loading, error } = useEvents(
    filter === 'upcoming' ? { upcoming: true } : {}
  )

  const displayed =
    filter === 'past' ? events.filter((e) => e.is_past) : events

  return (
    <>
      <div className="page-hero">
        <div className="section-tag">Agenda</div>
        <h1>Nos événements</h1>
        <p>
          Concerts, répétitions ouvertes et soirées culturelles du Chœur Gabonais
          de France.
        </p>
      </div>

      <section>
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`tab${filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loader">{FORM_MESSAGES.loading.loading} des événements…</div>
        )}
        {error && <div className="error-msg">Erreur : {error}</div>}

        {!loading && !error && (
          <div className="events-grid">
            {displayed.length === 0 ? (
              <div className="empty">
                <p>Aucun événement pour ce filtre.</p>
              </div>
            ) : (
              displayed.map((ev) => {
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
                    </div>
                  </article>
                )
              })
            )}
          </div>
        )}
      </section>
    </>
  )
}
