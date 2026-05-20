import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="admin-layout">
      <header className="admin-mobile-header">
        <button
          className="admin-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <span className="admin-mobile-title">Admin CGdF</span>
      </header>

      {menuOpen && <div className="admin-overlay" onClick={closeMenu} />}

      <aside className={`admin-sidebar${menuOpen ? ' open' : ''}`}>
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
              onClick={closeMenu}
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
