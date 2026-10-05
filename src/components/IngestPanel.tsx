import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ingestPath, ingestUpload, type IngestResponse } from '../api'

export default function IngestPanel({ onIngested }: { onIngested: () => void }) {
  const [path, setPath] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function report(res: IngestResponse) {
    setMessage(`Ingested ${res.ingested_chunks} chunk(s). Total documents: ${res.documents}.`)
    setError(null)
    onIngested()
  }

  async function submitPath(e: FormEvent) {
    e.preventDefault()
    const p = path.trim()
    if (!p) return
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      report(await ingestPath(p))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      report(await ingestUpload(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="panel ingest-panel">
      <section>
        <h3>Ingest a server path</h3>
        <p className="hint">A file or folder path accessible to the API host.</p>
        <form className="composer" onSubmit={submitPath}>
          <input
            type="text"
            placeholder="/u01/transcripts"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
          <button type="submit" disabled={busy}>
            Ingest
          </button>
        </form>
      </section>

      <section>
        <h3>Upload a document</h3>
        <p className="hint">Supported: .txt, .md, .pdf, .docx</p>
        <label className="file-button">
          {busy ? 'Working…' : 'Choose file'}
          <input
            type="file"
            accept=".txt,.md,.pdf,.docx"
            onChange={onFile}
            disabled={busy}
            hidden
          />
        </label>
      </section>

      {message && <div className="banner success">{message}</div>}
      {error && <div className="banner error">{error}</div>}
    </div>
  )
}
