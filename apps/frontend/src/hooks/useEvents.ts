import { useState, useEffect } from 'react'
import type { Event } from '@choeur/shared'
import { eventService } from '../services/events'

interface Options { featured?: boolean; upcoming?: boolean }

export function useEvents(options: Options = {}) {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    eventService.getAll(options)
      .then(setEvents)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.featured, options.upcoming])

  return { events, loading, error }
}
