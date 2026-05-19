import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthenticated(!!data.user)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="admin-loading">Chargement…</div>
  if (!authenticated) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
