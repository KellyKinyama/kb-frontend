import type { HealthResponse } from '../api'

export default function StatusBar({
  health,
  onRefresh,
}: {
  health: HealthResponse | null
  onRefresh: () => void
}) {
  return (
    <footer className="status-bar">
      {health ? (
        <>
          <span className="dot ok" />
          <span>{health.documents} document(s)</span>
          <span className="sep">·</span>
          <span title={health.embed_model}>{health.embed_model.split('/').pop()}</span>
        </>
      ) : (
        <>
          <span className="dot off" />
          <span>API offline</span>
        </>
      )}
      <button className="link" onClick={onRefresh}>
        Refresh
      </button>
    </footer>
  )
}
