export interface Event {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  image_url?: string
  is_past: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface GalleryAlbum {
  id: string
  title: string
  description?: string
  cover_url?: string
  event_id?: string
  created_at: string
}

export interface GalleryPhoto {
  id: string
  album_id: string
  url: string
  caption?: string
  sort_order: number
  created_at: string
}

export type MediaType = 'video' | 'audio'

export interface Media {
  id: string
  type: MediaType
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  duration?: string
  event_id?: string
  sort_order: number
  created_at: string
}

export type VoiceType = 'soprano' | 'mezzo-soprano' | 'alto' | 'tenor' | 'baryton' | 'basse' | 'autre'
export type ApplicationStatus = 'pending' | 'contacted' | 'accepted' | 'rejected'

export interface MemberApplication {
  id: string
  full_name: string
  email: string
  phone?: string
  voice_type?: VoiceType
  experience?: string
  motivation?: string
  status: ApplicationStatus
  created_at: string
}

export interface ContactMessage {
  id: string
  full_name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
  created_at: string
}

export interface TeamMember {
  id: string
  full_name: string
  role: string
  bio?: string
  photo_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface SiteSettings {
  association_name: string
  association_email: string
  association_phone: string
  association_address: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  about_text: string
  [key: string]: string
}

export interface CreateEventDto {
  title: string
  description?: string
  date: string
  location?: string
  image_url?: string
  is_featured?: boolean
}

export interface CreateApplicationDto {
  full_name: string
  email: string
  phone?: string
  voice_type?: VoiceType
  experience?: string
  motivation?: string
}

export interface CreateContactDto {
  full_name: string
  email: string
  subject?: string
  message: string
}
