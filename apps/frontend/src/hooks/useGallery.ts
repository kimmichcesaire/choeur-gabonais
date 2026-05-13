import { useState, useEffect } from 'react'
import type { GalleryAlbum, GalleryPhoto } from '@choeur/shared'
import { galleryService } from '../services/gallery'

export function useAlbums() {
  const [albums, setAlbums]   = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    galleryService.getAlbums()
      .then(setAlbums)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { albums, loading, error }
}

export function usePhotos(albumId: string | null) {
  const [photos, setPhotos]   = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!albumId) return
    setLoading(true)
    galleryService.getPhotosByAlbum(albumId)
      .then(setPhotos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [albumId])

  return { photos, loading, error }
}
