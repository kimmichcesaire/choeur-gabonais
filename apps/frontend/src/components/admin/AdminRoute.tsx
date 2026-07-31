import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(data.user?.app_metadata?.role === 'admin')
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="admin-loading">Chargement…</div>
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
