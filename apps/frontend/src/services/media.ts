import { supabase } from './supabase'
import type { Media, MediaType } from '@choeur/shared'

export const mediaService = {
  async getAll(type?: MediaType): Promise<Media[]> {
    let q = supabase.from('media').select('*').order('sort_order')
    if (type) q = q.eq('type', type)
    const { data, error } = await q
    if (error) throw error
    return data ?? []
  },
}
