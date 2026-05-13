import { useState, useEffect } from 'react'
import type { Media, MediaType } from '@choeur/shared'
import { mediaService } from '../services/media'

export function useMedia(type?: MediaType) {
  const [media, setMedia]     = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    mediaService.getAll(type)
      .then(setMedia)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [type])

  return { media, loading, error }
}
