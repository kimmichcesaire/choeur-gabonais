import { supabase } from './supabase'
import type { Media, MediaType } from '@choeur/shared'

interface MediaDto {
  type: MediaType
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  duration?: string
  sort_order?: number
}

export const mediaService = {
  async getAll(type?: MediaType): Promise<Media[]> {
    let q = supabase.from('media').select('*').order('sort_order')
    if (type) q = q.eq('type', type)
    const { data, error } = await q
    if (error) throw error
    return data ?? []
  },

  async create(dto: MediaDto): Promise<Media> {
    const { data, error } = await supabase.from('media').insert(dto).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, dto: Partial<MediaDto>): Promise<Media> {
    const { data, error } = await supabase.from('media').update(dto).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('media').delete().eq('id', id)
    if (error) throw error
  },

  async uploadFile(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    return data.publicUrl
  },
}
