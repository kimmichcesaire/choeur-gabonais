/**
 * Service API centralisé avec gestion d'erreurs cohérente
 */

import type { CreateApplicationDto, CreateContactDto } from '@choeur/shared'
import { FORM_MESSAGES } from '../utils/constants'
import type { ApiResponse, ApiError } from '../types/api'

const BASE = import.meta.env.VITE_API_URL as string

/**
 * Classe personnalisée pour les erreurs API
 */
export class ApiErrorException extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
  ) {
    super(message)
    this.name = 'ApiErrorException'
  }
}

/**
 * Extrait le message d'erreur depuis la réponse JSON
 */
function extractErrorMessage(json: unknown): string | null {
  if (typeof json !== 'object' || json === null) return null

  const data = json as Record<string, unknown>
  const message = data.message

  if (typeof message === 'string') return message
  if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'string') {
    return message[0]
  }

  return null
}

/**
 * Requête POST générique avec gestion d'erreurs
 */
async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response

  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiErrorException(
      FORM_MESSAGES.errors.network,
      undefined,
    )
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new ApiErrorException(
        FORM_MESSAGES.errors.tooManyRequests,
        429,
      )
    }

    if (res.status >= 500) {
      throw new ApiErrorException(
        FORM_MESSAGES.errors.server,
        res.status,
      )
    }

    let errorMsg: string = FORM_MESSAGES.errors.generic
    try {
      const json = await res.json() as ApiError
      const extractedMsg = extractErrorMessage(json)
      if (extractedMsg) errorMsg = extractedMsg
    } catch {
      // Response body n'est pas du JSON, on garde le message générique
    }

    throw new ApiErrorException(errorMsg, res.status)
  }

  const responseData = (await res.json()) as ApiResponse<T>

  if (!responseData.success && responseData.error) {
    throw new ApiErrorException(responseData.error, res.status)
  }

  return (responseData.data ?? responseData) as T
}

/**
 * API publique avec méthodes typées
 */
export const api = {
  submitApplication: (dto: CreateApplicationDto) =>
    post<ApiResponse>('/members/apply', dto),
  submitContact: (dto: CreateContactDto) =>
    post<ApiResponse>('/contact', dto),
}
