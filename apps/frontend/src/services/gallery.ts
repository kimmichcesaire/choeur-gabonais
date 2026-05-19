import { supabase } from './supabase'
import type { GalleryAlbum, GalleryPhoto } from '@choeur/shared'

export const galleryService = {
  async getAlbums(): Promise<GalleryAlbum[]> {
    const { data, error } = await supabase.from('gallery_albums').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async createAlbum(dto: { title: string; description?: string }): Promise<GalleryAlbum> {
    const { data, error } = await supabase.from('gallery_albums').insert(dto).select().single()
    if (error) throw error
    return data
  },

  async deleteAlbum(id: string): Promise<void> {
    const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
    if (error) throw error
  },

  async getPhotosByAlbum(albumId: string): Promise<GalleryPhoto[]> {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('album_id', albumId)
      .order('sort_order')
    if (error) throw error
    return data ?? []
  },

  async addPhoto(dto: { album_id: string; url: string; caption?: string; sort_order?: number }): Promise<GalleryPhoto> {
    const { data, error } = await supabase.from('gallery_photos').insert(dto).select().single()
    if (error) throw error
    return data
  },

  async deletePhoto(id: string): Promise<void> {
    const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
    if (error) throw error
  },

  async uploadPhoto(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('gallery').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    return data.publicUrl
  },
}
