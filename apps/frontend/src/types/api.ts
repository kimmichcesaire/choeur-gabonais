/**
 * Types de réponse API standardisés
 */

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface ApiError {
    message: string | string[]
    statusCode?: number
    timestamp?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
}
