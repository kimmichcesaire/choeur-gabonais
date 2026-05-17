import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/evenements', label: 'Événements' },
  { to: '/medias', label: 'Médias' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/a-propos', label: 'À propos' },
]

export default function Navbar() {
  const isNavOpen = useAppStore((s) => s.isNavOpen)
  const toggleNav = useAppStore((s) => s.toggleNav)
  const closeNav = useAppStore((s) => s.closeNav)

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isNavOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isNavOpen])

  // Fermer le menu sur Échap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeNav() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeNav])

  return (
    <>
      <nav className="navbar">
        <NavLink to="/" className="navbar-Photo_principale" onClick={closeNav}>
          <img src="/logo.jpg" alt="Logo Chœur Gabonais" className="navbar-logo-img" />
          <div className="flag-bar" />
        </NavLink>

        {/* Liens desktop */}
        <ul className="navbar-links">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}>
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/contact" className="btn-nav">Nous rejoindre</NavLink>
          </li>
        </ul>

        {/* Bouton hamburger (mobile uniquement) */}
        <button
          className={`hamburger${isNavOpen ? ' open' : ''}`}
          onClick={toggleNav}
          aria-label={isNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isNavOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Menu mobile */}
      {isNavOpen && (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-label="Menu de navigation">
          <ul>
            {LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={closeNav}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li><div className="mobile-menu-divider" /></li>
            <li>
              <NavLink to="/contact" className="mobile-cta" onClick={closeNav}>
                🎵 Nous rejoindre
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
