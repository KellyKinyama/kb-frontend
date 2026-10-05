import { useCallback, useEffect, useState } from 'react'
import { getHealth, type HealthResponse } from './api'
import AskPanel from './components/AskPanel'
import SearchPanel from './components/SearchPanel'
import IngestPanel from './components/IngestPanel'
import StatusBar from './components/StatusBar'

type Tab = 'ask' | 'search' | 'ingest'

export default function App() {
  const [tab, setTab] = useState<Tab>('ask')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refreshHealth = useCallback(async () => {
    try {
      setHealth(await getHealth())
      setError(null)
    } catch (e) {
      setHealth(null)
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    void refreshHealth()
  }, [refreshHealth])

  return (
    <div className="app">
      <header className="app-header">
        <h1>ZESCO Knowledge Base</h1>
        <nav className="tabs">
          <button className={tab === 'ask' ? 'active' : ''} onClick={() => setTab('ask')}>
            Ask
          </button>
          <button className={tab === 'search' ? 'active' : ''} onClick={() => setTab('search')}>
            Search
          </button>
          <button className={tab === 'ingest' ? 'active' : ''} onClick={() => setTab('ingest')}>
            Ingest
          </button>
        </nav>
      </header>

      {error && <div className="banner error">Cannot reach API: {error}</div>}

      <main className="content">
        {tab === 'ask' && <AskPanel />}
        {tab === 'search' && <SearchPanel />}
        {tab === 'ingest' && <IngestPanel onIngested={refreshHealth} />}
      </main>

      <StatusBar health={health} onRefresh={refreshHealth} />
    </div>
  )
}
