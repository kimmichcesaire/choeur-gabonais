import { useState } from 'react'
import { useMedia } from '../hooks/useMedia'
import type { MediaType } from '@choeur/shared'

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return m ? m[1] : null
}

export default function MediaPage() {
  const [tab, setTab] = useState<MediaType>('video')
  const { media, loading, error } = useMedia(tab)

  return (
    <>
      <div className="page-hero">
        <div className="section-tag">Médiathèque</div>
        <h1>Nos médias</h1>
        <p>Revivez nos concerts et découvrez notre répertoire en vidéo et en audio.</p>
      </div>

      <section>
        <div className="media-tabs">
          <button className={`tab${tab === 'video' ? ' active' : ''}`} onClick={() => setTab('video')}>🎬 Vidéos</button>
          <button className={`tab${tab === 'audio' ? ' active' : ''}`} onClick={() => setTab('audio')}>🎵 Audios</button>
        </div>

        {loading && <div className="loader">Chargement…</div>}
        {error   && <div className="error-msg">Erreur : {error}</div>}

        {!loading && !error && (
          <div className="media-grid">
            {media.length === 0 ? (
              <div className="empty"><p>Aucun média disponible pour le moment.</p></div>
            ) : media.map((m) => {
              if (m.type === 'video') {
                const vid = getYoutubeId(m.url)
                return (
                  <div className="media-card" key={m.id}>
                    <div className="video-thumb">
                      {m.thumbnail_url
                        ? <img src={m.thumbnail_url} alt={m.title} />
                        : vid && <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={m.title} />
                      }
                      {vid && (
                        <a
                          className="play-btn"
                          href={`https://www.youtube.com/watch?v=${vid}`}
                          target="_blank"
                          rel="noreferrer"
                        >▶️</a>
                      )}
                    </div>
                    <div className="media-card-info">
                      <h3>{m.title}</h3>
                      {m.description && <p>{m.description}</p>}
                    </div>
                  </div>
                )
              }
              return (
                <div className="media-card audio-card" key={m.id}>
                  <h3>{m.title}</h3>
                  {m.description && <p>{m.description}</p>}
                  <audio controls src={m.url} style={{ width: '100%' }} />
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
