import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, media: 0, albums: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('media').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_albums').select('id', { count: 'exact', head: true }),
    ]).then(([ev, me, al]) => {
      setStats({ events: ev.count ?? 0, media: me.count ?? 0, albums: al.count ?? 0 })
    })
  }, [])

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans l'espace d'administration du Chœur Gabonais de France.</p>
      </div>

      <div className="admin-stats-grid">
        <Link to="/admin/evenements" className="admin-stat-card">
          <span className="admin-stat-icon">📅</span>
          <span className="admin-stat-number">{stats.events}</span>
          <span className="admin-stat-label">Événements</span>
        </Link>
        <Link to="/admin/medias" className="admin-stat-card">
          <span className="admin-stat-icon">🎬</span>
          <span className="admin-stat-number">{stats.media}</span>
          <span className="admin-stat-label">Médias</span>
        </Link>
        <Link to="/admin/galerie" className="admin-stat-card">
          <span className="admin-stat-icon">🖼️</span>
          <span className="admin-stat-number">{stats.albums}</span>
          <span className="admin-stat-label">Albums</span>
        </Link>
      </div>
    </AdminLayout>
  )
}
