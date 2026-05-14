/**
 * Service Supabase centralisé avec gestion d'erreurs
 */

import { supabase } from './supabase'
import { FORM_MESSAGES } from '../utils/constants'
import type { PostgrestError } from '@supabase/supabase-js'

export interface QueryOptions {
    select?: string
    filter?: { [key: string]: unknown }
    order?: { field: string; ascending?: boolean }
    limit?: number
}

class SupabaseServiceError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
        public readonly originalError?: PostgrestError,
    ) {
        super(message)
        this.name = 'SupabaseServiceError'
    }
}

/**
 * Service Supabase abstrait pour centraliser la logique de requête
 */
export const supabaseService = {
    /**
     * Lecture générique avec gestion d'erreurs
     */
    async read<T>(
        table: string,
        options: QueryOptions = {},
    ): Promise<T[]> {
        try {
            let query = supabase.from(table).select(options.select ?? '*')

            if (options.filter) {
                Object.entries(options.filter).forEach(([key, value]) => {
                    query = query.eq(key, value)
                })
            }

            if (options.order) {
                query = query.order(options.order.field, {
                    ascending: options.order.ascending ?? true,
                })
            }

            if (options.limit) {
                query = query.limit(options.limit)
            }

            const { data, error } = await query

            if (error) {
                throw new SupabaseServiceError(
                    FORM_MESSAGES.errors.generic,
                    error.code,
                    error,
                )
            }

            return (data as T[]) ?? []
        } catch (err) {
            if (err instanceof SupabaseServiceError) throw err
            throw new SupabaseServiceError(FORM_MESSAGES.errors.generic)
        }
    },

    /**
     * Lecture d'un seul enregistrement
     */
    async readOne<T>(
        table: string,
        id: string,
    ): Promise<T | null> {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                throw new SupabaseServiceError(
                    FORM_MESSAGES.errors.generic,
                    error.code,
                    error,
                )
            }

            return data as T | null
        } catch (err) {
            if (err instanceof SupabaseServiceError) throw err
            throw new SupabaseServiceError(FORM_MESSAGES.errors.generic)
        }
    },

    /**
     * Insertion
     */
    async insert<T>(
        table: string,
        data: unknown,
    ): Promise<T> {
        try {
            const { data: result, error } = await supabase
                .from(table)
                .insert(data as Record<string, unknown>)
                .select()
                .single()

            if (error) {
                throw new SupabaseServiceError(
                    FORM_MESSAGES.errors.generic,
                    error.code,
                    error,
                )
            }

            return result as T
        } catch (err) {
            if (err instanceof SupabaseServiceError) throw err
            throw new SupabaseServiceError(FORM_MESSAGES.errors.generic)
        }
    },
}

export { SupabaseServiceError }
