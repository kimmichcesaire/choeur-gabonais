import type { CreateApplicationDto, CreateContactDto } from '@choeur/shared'
import { FORM_MESSAGES } from '../utils/constants'
import { supabase } from './supabase'

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

export const api = {
  submitApplication: async (dto: CreateApplicationDto): Promise<void> => {
    const { error } = await supabase.functions.invoke('submit-application', { body: dto })
    if (error) throw new ApiErrorException(FORM_MESSAGES.errors.generic)
  },
  submitContact: async (dto: CreateContactDto): Promise<void> => {
    const { error } = await supabase.functions.invoke('submit-contact', { body: dto })
    if (error) throw new ApiErrorException(FORM_MESSAGES.errors.generic)
  },
}
