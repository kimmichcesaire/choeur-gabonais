import { useEffect, useRef, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { mediaService } from '../../services/media'
import type { Media } from '@choeur/shared'

const EMPTY_FORM = {
  type: 'video' as 'video' | 'audio',
  title: '',
  description: '',
  url: '',
  thumbnail_url: '',
  sort_order: 0,
}

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Media | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    mediaService.getAll().then(setMedia).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSelectedFile(null)
    setError('')
    setUploadProgress('')
    setShowForm(true)
  }

  const openEdit = (m: Media) => {
    setEditing(m)
    setForm({
      type: m.type,
      title: m.title,
      description: m.description ?? '',
      url: m.url,
      thumbnail_url: m.thumbnail_url ?? '',
      sort_order: m.sort_order,
    })
    setSelectedFile(null)
    setError('')
    setUploadProgress('')
    setShowForm(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    if (!form.title) {
      const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      setForm(f => ({ ...f, title: name }))
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile && !form.url.trim()) {
      setError('Sélectionne un fichier ou entre une URL YouTube.')
      return
    }
    setSaving(true)
    setError('')
    try {
      let url = form.url
      if (selectedFile) {
        setUploadProgress('Upload en cours…')
        url = await mediaService.uploadFile(selectedFile)
        setUploadProgress('')
      }
      const dto = {
        type: form.type,
        title: form.title,
        description: form.description || undefined,
        url,
        thumbnail_url: form.thumbnail_url || undefined,
        sort_order: form.sort_order,
      }
      if (editing) {
        await mediaService.update(editing.id, dto)
      } else {
        await mediaService.create(dto)
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
      setUploadProgress('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce média ?')) return
    await mediaService.delete(id)
    load()
  }

  const acceptType = form.type === 'video' ? 'video/*' : 'audio/*'
  const isHosted = (url: string) => url.includes('supabase') || url.endsWith('.mp4') || url.endsWith('.mp3')

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Médias</h1>
        <button className="admin-btn-add" onClick={openAdd}>+ Ajouter</button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <form className="admin-modal" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <h2>{editing ? 'Modifier' : 'Ajouter'} un média</h2>
            {error && <div className="admin-error">{error}</div>}

            <div className="form-group">
              <label>Type *</label>
              <select
                value={form.type}
                onChange={e => {
                  setForm(f => ({ ...f, type: e.target.value as 'video' | 'audio' }))
                  clearFile()
                }}
              >
                <option value="video">Vidéo</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fichier {form.type === 'video' ? '(MP4, MOV, AVI…)' : '(MP3, WAV, OGG…)'}</label>
              <label className="admin-file-pick">
                <span>{selectedFile ? selectedFile.name : `📂 Choisir depuis l'explorateur`}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptType}
                  hidden
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <button type="button" className="admin-file-clear" onClick={clearFile}>
                  ✕ Retirer le fichier
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="admin-label-or">
                {selectedFile ? '— ou URL YouTube (ignorée si fichier sélectionné) —' : '— ou URL YouTube —'}
              </label>
              <input
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
                disabled={!!selectedFile}
              />
            </div>

            <div className="form-group">
              <label>Titre *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>

            {!selectedFile && (
              <div className="form-group">
                <label>URL Miniature (pour YouTube)</label>
                <input
                  value={form.thumbnail_url}
                  onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="form-group">
              <label>Ordre d'affichage</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
              />
            </div>

            <div className="admin-modal-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="admin-btn-save" disabled={saving}>
                {uploadProgress || (saving ? 'Enregistrement…' : 'Enregistrer')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="admin-loading">Chargement…</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Type</th><th>Titre</th><th>Source</th><th>Ordre</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {media.map(m => (
                <tr key={m.id}>
                  <td><span className={`admin-badge ${m.type}`}>{m.type}</span></td>
                  <td>{m.title}</td>
                  <td className="admin-url">
                    {isHosted(m.url) ? '📁 Fichier hébergé' : m.url}
                  </td>
                  <td>{m.sort_order}</td>
                  <td className="admin-actions">
                    <button className="admin-btn-edit" onClick={() => openEdit(m)}>✏️</button>
                    <button className="admin-btn-delete" onClick={() => handleDelete(m.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {media.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '24px' }}>Aucun média.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
