/**
 * Service Supabase abstrait pour standardiser l'accès aux données
 * Gère la logique répétée : gestion d'erreurs, logging, etc.
 */

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'

export interface QueryOptions {
    select?: string
    filter?: Record<string, unknown>
    order?: { field: string; ascending?: boolean }
    limit?: number
}

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name)

    constructor(private supabaseService: SupabaseService) { }

    // Le backend utilise le client admin (service_role) pour bypasser RLS.
    // Fallback sur le client public si la service_role key n'est pas configurée.
    private get supabase() { return this.supabaseService.admin ?? this.supabaseService.public }

    /**
     * Lecture générique avec gestion d'erreurs
     */
    async read<T>(table: string, options: QueryOptions = {}): Promise<T[]> {
        try {
            let query = this.supabase.from(table).select(options.select ?? '*')

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
                this.logger.error(
                    `Erreur lecture ${table}`,
                    error.message,
                )
                throw new InternalServerErrorException(
                    'Une erreur est survenue, veuillez réessayer.',
                )
            }

            return (data as T[]) ?? []
        } catch (err) {
            if (err instanceof InternalServerErrorException) throw err
            this.logger.error(`Erreur non gérée [${table}]`, err)
            throw new InternalServerErrorException(
                'Une erreur est survenue, veuillez réessayer.',
            )
        }
    }

    /**
     * Lecture d'un seul enregistrement
     */
    async readOne<T>(table: string, id: string): Promise<T | null> {
        try {
            const { data, error } = await this.supabase
                .from(table)
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                this.logger.error(`Erreur lecture ${table}(${id})`, error.message)
                throw new InternalServerErrorException(
                    'Enregistrement introuvable.',
                )
            }

            return data as T | null
        } catch (err) {
            if (err instanceof InternalServerErrorException) throw err
            this.logger.error(`Erreur non gérée [${table}]`, err)
            throw new InternalServerErrorException(
                'Une erreur est survenue, veuillez réessayer.',
            )
        }
    }

    /**
     * Insertion avec sélection du résultat
     */
    async insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .insert(data)
                .select()
                .single()

            if (error) {
                this.logger.error(`Erreur insertion ${table}`, error.message)
                throw new InternalServerErrorException(
                    'Une erreur est survenue, veuillez réessayer.',
                )
            }

            return result as T
        } catch (err) {
            if (err instanceof InternalServerErrorException) throw err
            this.logger.error(`Erreur non gérée [${table}]`, err)
            throw new InternalServerErrorException(
                'Une erreur est survenue, veuillez réessayer.',
            )
        }
    }

    /**
     * Mise à jour avec sélection du résultat
     */
    async update<T>(
        table: string,
        id: string,
        data: Partial<unknown>,
    ): Promise<T> {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select()
                .single()

            if (error) {
                this.logger.error(`Erreur mise à jour ${table}(${id})`, error.message)
                throw new InternalServerErrorException(
                    'Une erreur est survenue, veuillez réessayer.',
                )
            }

            return result as T
        } catch (err) {
            if (err instanceof InternalServerErrorException) throw err
            this.logger.error(`Erreur non gérée [${table}]`, err)
            throw new InternalServerErrorException(
                'Une erreur est survenue, veuillez réessayer.',
            )
        }
    }

    /**
     * Suppression
     */
    async delete(table: string, id: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from(table)
                .delete()
                .eq('id', id)

            if (error) {
                this.logger.error(`Erreur suppression ${table}(${id})`, error.message)
                throw new InternalServerErrorException(
                    'Une erreur est survenue, veuillez réessayer.',
                )
            }
        } catch (err) {
            if (err instanceof InternalServerErrorException) throw err
            this.logger.error(`Erreur non gérée [${table}]`, err)
            throw new InternalServerErrorException(
                'Une erreur est survenue, veuillez réessayer.',
            )
        }
    }
}
