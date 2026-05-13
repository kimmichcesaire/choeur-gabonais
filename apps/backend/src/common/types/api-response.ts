/**
 * Types de réponse standardisés pour l'API NestJS
 */

export interface ApiResponseSuccess<T = unknown> {
    success: true
    data?: T
    message?: string
}

export interface ApiResponseError {
    success: false
    error: string
    message?: string
}

export type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError
