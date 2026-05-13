import { supabase } from './supabase'
import type { Event, CreateEventDto } from '@choeur/shared'

interface EventFilters {
  featured?: boolean
  upcoming?: boolean
}

export const eventService = {
  async getAll({ featured, upcoming }: EventFilters = {}): Promise<Event[]> {
    let q = supabase.from('events').select('*').order('date', { ascending: true })
    if (featured) q = q.eq('is_featured', true)
    if (upcoming) q = q.eq('is_past', false)
    const { data, error } = await q
    if (error) throw error
    return data ?? []
  },

  async getById(id: string): Promise<Event> {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async create(dto: CreateEventDto): Promise<Event> {
    const { data, error } = await supabase.from('events').insert(dto).select().single()
    if (error) throw error
    return data
  },
}
