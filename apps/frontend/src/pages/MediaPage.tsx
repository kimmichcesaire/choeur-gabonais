import { useState } from 'react'
import { useMedia } from '../hooks/useMedia'
import type { MediaType } from '@choeur/shared'

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return m ? m[1] : null
}

const STATIC_VIDEOS = [
  { src: '/Qui_sommes-nous_cgdf.mp4', title: 'Qui sommes-nous ?' },
  { src: '/repetitions-acharnees.mp4', title: 'Répétitions acharnées — un défi à relever ensemble' },
  { src: '/retour-fete-musique.mp4', title: 'Retour en images sur la fête de la musique' },
]

export default function MediaPage() {
  const [tab, setTab] = useState<MediaType>('video')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const { media, loading, error } = useMedia(tab)

  return (
    <>
      <div className="page-hero">
        <div className="section-tag">Médiathèque</div>
        <h1>Nos médias</h1>
        <p>
          Le répertoire du Choeur est diverse et
          varié, il se veut inclusif et polyvalent.
          Le choeur interprète des musiques
          contemporaines, urbaines,
          classiques, gospels, negro spiritual,
          classiques traditionnelles.
          <br /> <br />
          Dans une optique d'intégration et d'acculturation, il ne restreint pas son répertoire
          d'exécution et s'adapte ainsi à toutes les cultures du monde selon le type d'évènement et/ou
          de prestataire.
        </p>
        <br /> <br />

        <p>Revivez nos concerts et découvrez notre répertoire en vidéo et en audio.</p>
      </div>

      <section>
        <div className="media-tabs">
          <button className={`tab${tab === 'video' ? ' active' : ''}`} onClick={() => { setTab('video'); setPlayingId(null) }}>🎬 Vidéos</button>
          <button className={`tab${tab === 'audio' ? ' active' : ''}`} onClick={() => { setTab('audio'); setPlayingId(null) }}>🎵 Audios</button>
        </div>

        {loading && <div className="loader">Chargement…</div>}
        {error && <div className="error-msg">Erreur : {error}</div>}

        {!loading && !error && tab === 'video' && (
          <div className="media-grid">
            {STATIC_VIDEOS.map((v) => (
              <div className="media-card" key={v.src}>
                <video className="media-file-video" src={v.src} controls playsInline />
                <div className="media-card-info">
                  <h3>{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="media-grid">
            {media.length === 0 ? (
              <div className="empty"></div>
            ) : media.map((m) => {
              if (m.type === 'video') {
                const vid = getYoutubeId(m.url)
                const isMp4 = m.url.endsWith('.mp4') || m.url.includes('.mp4') || m.url.includes('supabase')
                return (
                  <div className="media-card" key={m.id}>
                    {isMp4 ? (
                      <video
                        className="media-file-video"
                        src={m.url}
                        controls
                        playsInline
                      />
                    ) : (
                      <div className="video-thumb">
                        {playingId === m.id && vid ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${vid}?autoplay=1`}
                            title={m.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            {m.thumbnail_url
                              ? <img src={m.thumbnail_url} alt={m.title} />
                              : vid && <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt={m.title} />
                            }
                            {vid && (
                              <button
                                className="play-btn"
                                onClick={() => setPlayingId(m.id)}
                                aria-label={`Lire ${m.title}`}
                              >▶</button>
                            )}
                          </>
                        )}
                      </div>
                    )}
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
