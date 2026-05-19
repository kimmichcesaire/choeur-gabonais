import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { galleryService } from '../../services/gallery'
import type { GalleryAlbum, GalleryPhoto } from '@choeur/shared'

export default function AdminGallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null)
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')
  const [showAlbumForm, setShowAlbumForm] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState('')

  const loadAlbums = () => {
    setLoading(true)
    galleryService.getAlbums().then(setAlbums).finally(() => setLoading(false))
  }

  const loadPhotos = (album: GalleryAlbum) => {
    setSelectedAlbum(album)
    setPhotosLoading(true)
    galleryService.getPhotosByAlbum(album.id).then(setPhotos).finally(() => setPhotosLoading(false))
  }

  useEffect(() => { loadAlbums() }, [])

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAlbumTitle.trim()) return
    await galleryService.createAlbum({ title: newAlbumTitle })
    setNewAlbumTitle('')
    setShowAlbumForm(false)
    loadAlbums()
  }

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm('Supprimer cet album et toutes ses photos ?')) return
    await galleryService.deleteAlbum(id)
    if (selectedAlbum?.id === id) setSelectedAlbum(null)
    loadAlbums()
  }

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAlbum || !e.target.files?.[0]) return
    setUploadingPhoto(true)
    setError('')
    try {
      const url = await galleryService.uploadPhoto(e.target.files[0])
      await galleryService.addPhoto({ album_id: selectedAlbum.id, url, sort_order: photos.length })
      loadPhotos(selectedAlbum)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    await galleryService.deletePhoto(id)
    if (selectedAlbum) loadPhotos(selectedAlbum)
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Galerie</h1>
        <button className="admin-btn-add" onClick={() => setShowAlbumForm(true)}>+ Nouvel album</button>
      </div>

      {showAlbumForm && (
        <div className="admin-modal-overlay" onClick={() => setShowAlbumForm(false)}>
          <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleCreateAlbum}>
            <h2>Créer un album</h2>
            <div className="form-group">
              <label>Titre de l'album *</label>
              <input required value={newAlbumTitle} onChange={e => setNewAlbumTitle(e.target.value)} placeholder="Ex: Concert de Noël 2024" />
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => setShowAlbumForm(false)}>Annuler</button>
              <button type="submit" className="admin-btn-save">Créer</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-gallery-layout">
        <div className="admin-albums-list">
          <h3>Albums</h3>
          {loading ? <div className="admin-loading">Chargement…</div> : (
            albums.map(album => (
              <div
                key={album.id}
                className={`admin-album-item${selectedAlbum?.id === album.id ? ' active' : ''}`}
                onClick={() => loadPhotos(album)}
              >
                <span>{album.title}</span>
                <button className="admin-btn-delete" onClick={e => { e.stopPropagation(); handleDeleteAlbum(album.id) }}>🗑️</button>
              </div>
            ))
          )}
        </div>

        <div className="admin-photos-panel">
          {selectedAlbum ? (
            <>
              <div className="admin-photos-header">
                <h3>{selectedAlbum.title}</h3>
                <label className={`admin-btn-add${uploadingPhoto ? ' disabled' : ''}`}>
                  {uploadingPhoto ? 'Upload…' : '+ Ajouter une photo'}
                  <input type="file" accept="image/*" hidden onChange={handleUploadPhoto} disabled={uploadingPhoto} />
                </label>
              </div>
              {error && <div className="admin-error">{error}</div>}
              {photosLoading ? <div className="admin-loading">Chargement…</div> : (
                <div className="admin-photos-grid">
                  {photos.map(photo => (
                    <div key={photo.id} className="admin-photo-item">
                      <img src={photo.url} alt={photo.caption ?? ''} />
                      {photo.caption && <p>{photo.caption}</p>}
                      <button className="admin-photo-delete" onClick={() => handleDeletePhoto(photo.id)}>🗑️</button>
                    </div>
                  ))}
                  {photos.length === 0 && <p className="admin-empty">Aucune photo dans cet album.</p>}
                </div>
              )}
            </>
          ) : (
            <div className="admin-empty">Sélectionne un album pour voir ses photos.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
