import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

const NAV = [
  { to: '/admin', label: '📊 Tableau de bord', end: true },
  { to: '/admin/evenements', label: '📅 Événements' },
  { to: '/admin/medias', label: '🎬 Médias' },
  { to: '/admin/galerie', label: '🖼️ Galerie' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="flag-bar" />
          <span>Admin CGdF</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          🚪 Déconnexion
        </button>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
