import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { eventService } from '../../services/events'
import type { Event } from '@choeur/shared'

const EMPTY = { title: '', description: '', date: '', location: '', image_url: '', is_featured: false, is_past: false }

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    eventService.getAll().then(setEvents).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowForm(true) }
  const openEdit = (ev: Event) => {
    setEditing(ev)
    setForm({
      title: ev.title,
      description: ev.description ?? '',
      date: ev.date.slice(0, 16),
      location: ev.location ?? '',
      image_url: ev.image_url ?? '',
      is_featured: ev.is_featured,
      is_past: ev.is_past,
    })
    setError('')
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const dto = {
        title: form.title,
        description: form.description || undefined,
        date: form.date,
        location: form.location || undefined,
        image_url: form.image_url || undefined,
        is_featured: form.is_featured,
        is_past: form.is_past,
      }
      if (editing) {
        await eventService.update(editing.id, dto)
      } else {
        await eventService.create(dto)
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    await eventService.delete(id)
    load()
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Événements</h1>
        <button className="admin-btn-add" onClick={openAdd}>+ Ajouter</button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <h2>{editing ? 'Modifier' : 'Ajouter'} un événement</h2>
            {error && <div className="admin-error">{error}</div>}
            <div className="form-group">
              <label>Titre *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input required type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Lieu</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>URL Image</label>
              <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="admin-checkboxes">
              <label><input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} /> Mise en avant</label>
              <label><input type="checkbox" checked={form.is_past} onChange={e => setForm(f => ({ ...f, is_past: e.target.checked }))} /> Événement passé</label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="admin-btn-save" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="admin-loading">Chargement…</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Titre</th><th>Date</th><th>Lieu</th><th>Mis en avant</th><th>Passé</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td>{ev.title}</td>
                  <td>{new Date(ev.date).toLocaleDateString('fr-FR')}</td>
                  <td>{ev.location ?? '—'}</td>
                  <td>{ev.is_featured ? '✅' : '—'}</td>
                  <td>{ev.is_past ? '✅' : '—'}</td>
                  <td className="admin-actions">
                    <button className="admin-btn-edit" onClick={() => openEdit(ev)}>✏️</button>
                    <button className="admin-btn-delete" onClick={() => handleDelete(ev.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
