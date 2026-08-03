/**
 * Marqueur visuel pour une information légale encore manquante — impossible
 * à manquer avant publication, contrairement à un simple commentaire dans le code.
 */
export function LegalPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: '#fff3cd',
        color: '#856404',
        padding: '2px 6px',
        borderRadius: 4,
        fontWeight: 600,
      }}
    >
      [À COMPLÉTER : {children}]
    </span>
  )
}
