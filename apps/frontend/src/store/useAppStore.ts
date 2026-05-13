import { create } from 'zustand'
import type { SiteSettings } from '@choeur/shared'
import { supabase } from '../services/supabase'

interface AppState {
  settings: Partial<SiteSettings>
  isNavOpen: boolean
  toggleNav: () => void
  closeNav:  () => void
  loadSettings: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  settings:   {},
  isNavOpen:  false,
  toggleNav:  () => set((s) => ({ isNavOpen: !s.isNavOpen })),
  closeNav:   () => set({ isNavOpen: false }),

  loadSettings: async () => {
    const { data } = await supabase.from('site_settings').select('key, value')
    if (!data) return
    const settings = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
    set({ settings })
  },
}))
