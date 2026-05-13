/**
 * Hook personnalisé pour gérer les états de formulaire avec validation
 */

import { useState, useCallback } from 'react'

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export interface UseFormOptions<T> {
    initialValues: T
    onSubmit: (values: T) => Promise<void>
    onSuccess?: () => void
    onError?: (error: Error) => void
}

export function useForm<T extends object>({
    initialValues,
    onSubmit,
    onSuccess,
    onError,
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues)
    const [status, setStatus] = useState<FormStatus>('idle')
    const [error, setError] = useState<string>('')

    /**
     * Change un champ du formulaire
     */
    const setField = useCallback(
        (field: keyof T) => (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        ) => {
            setValues((prev) => ({
                ...prev,
                [field]: e.target.value,
            }))
            // Reset l'erreur en cas de nouvelle tentative
            if (error) setError('')
        },
        [error],
    )

    /**
     * Change plusieurs champs à la fois
     */
    const setFields = useCallback((updates: Partial<T>) => {
        setValues((prev) => ({ ...prev, ...updates }))
        if (error) setError('')
    }, [error])

    /**
     * Soumet le formulaire
     */
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            setStatus('loading')
            setError('')

            try {
                await onSubmit(values)
                setStatus('success')
                onSuccess?.()
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.'
                setError(message)
                setStatus('error')
                onError?.(err instanceof Error ? err : new Error(message))
            }
        },
        [values, onSubmit, onSuccess, onError],
    )

    /**
     * Réinitialise le formulaire
     */
    const reset = useCallback(() => {
        setValues(initialValues)
        setStatus('idle')
        setError('')
    }, [initialValues])

    return {
        values,
        status,
        error,
        setField,
        setFields,
        handleSubmit,
        reset,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
    }
}
