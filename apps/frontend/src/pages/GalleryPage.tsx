import { useState } from 'react'
import { useAlbums, usePhotos } from '../hooks/useGallery'
import { usePageMeta } from '../hooks/usePageMeta'
import type { GalleryAlbum } from '@choeur/shared'

export default function GalleryPage() {
  usePageMeta(
    'Galerie photos — Chœur Gabonais de France',
    'Photos des concerts et événements du Chœur Gabonais de France — revivez les moments forts en images.',
  )
  const [selected, setSelected] = useState<GalleryAlbum | null>(null)
  const { albums, loading: loadingAlbums } = useAlbums()
  const { photos, loading: loadingPhotos } = usePhotos(selected?.id ?? null)

  return (
    <>
      <div className="page-hero">
        <div className="section-tag">Galerie</div>
        <h1>Nos photos</h1>
        <p>Retrouvez les moments forts de nos concerts et événements.</p>
      </div>

      <section>
        <div className="gallery-static-grid">
          <div className="gallery-static-item">
            <img src="/p1.jpg" alt="Le chœur" />
          </div>
          <div className="gallery-static-item">
            <img src="/p4.jpg" alt="Le chœur" />
          </div>
        </div>
      </section>

      <section>
        {!selected ? (
          <>
            {loadingAlbums && <div className="loader">Chargement des albums…</div>}
            <div className="albums-grid">
              {albums.map((album) => (
                <div className="album-card" key={album.id} onClick={() => setSelected(album)}>
                  {album.cover_url
                    ? <img className="album-cover" src={album.cover_url} alt={album.title} />
                    : <div className="album-cover-placeholder">📷</div>
                  }
                  <div className="album-info">
                    <h3>{album.title}</h3>
                    {album.description && <p>{album.description}</p>}
                  </div>
                </div>
              ))}
              {!loadingAlbums && albums.length === 0 && (
                <div className="empty"></div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => setSelected(null)}>← Retour aux albums</button>
            <div className="section-header" style={{ marginBottom: 32 }}>
              <h2>{selected.title}</h2>
              {selected.description && <p>{selected.description}</p>}
            </div>
            {loadingPhotos && <div className="loader">Chargement des photos…</div>}
            <div className="photos-grid">
              {photos.map((photo) => (
                <div className="photo-item" key={photo.id}>
                  <img src={photo.url} alt={photo.caption ?? ''} />
                </div>
              ))}
              {!loadingPhotos && photos.length === 0 && (
                <div className="empty"></div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}
