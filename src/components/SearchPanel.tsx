import { useState, type FormEvent } from 'react'
import { search, type SearchResult } from '../api'

export default function SearchPanel() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    try {
      const data = await search(q)
      setResults(data.results)
      setSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <form className="composer" onSubmit={submit}>
        <input
          type="text"
          placeholder="Semantic search across documents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {error && <div className="banner error">{error}</div>}
      <div className="results">
        {searched && results.length === 0 && !loading && <p className="hint">No matches.</p>}
        {results.map((r, i) => (
          <div key={i} className="result">
            <div className="result-head">
              <span className="chip">{r.source}</span>
              <span className="score">{r.score.toFixed(3)}</span>
            </div>
            <p className="result-text">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
