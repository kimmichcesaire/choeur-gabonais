import { supabase } from './supabase'
import type { GalleryAlbum, GalleryPhoto } from '@choeur/shared'

export const galleryService = {
  async getAlbums(): Promise<GalleryAlbum[]> {
    const { data, error } = await supabase.from('gallery_albums').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
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
}
