import { useAppStore } from '../store/useAppStore'

export default function Footer() {
  const settings = useAppStore((s) => s.settings)
  const year     = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-logo">
        <div className="flag-bar" />
        <span>{settings.association_name ?? 'Chœur Gabonais de France'}</span>
      </div>
      <p>© {year} — Tous droits réservés</p>
      <p>{settings.association_email ?? 'contact@choeur-gabonais.fr'}</p>
    </footer>
  )
}
