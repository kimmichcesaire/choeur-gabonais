import { useEffect } from 'react'

/**
 * Définit le titre et la meta description de la page courante — les routes
 * React Router partagent sinon toutes le <title>/<meta> statiques d'index.html.
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
