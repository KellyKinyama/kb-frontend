import { useState, type FormEvent } from 'react'
import { ask, type AskResponse } from '../api'

interface Entry {
  question: string
  response?: AskResponse
  error?: string
  loading: boolean
}

export default function AskPanel() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<Entry[]>([])

  async function submit(e: FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!q) return
    setQuestion('')
    const index = history.length
    setHistory((h) => [...h, { question: q, loading: true }])
    try {
      const response = await ask(q)
      setHistory((h) =>
        h.map((en, i) => (i === index ? { ...en, response, loading: false } : en)),
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setHistory((h) =>
        h.map((en, i) => (i === index ? { ...en, error: msg, loading: false } : en)),
      )
    }
  }

  return (
    <div className="panel ask-panel">
      <div className="chat">
        {history.length === 0 && (
          <p className="hint">
            On a call with a tough question? Ask the knowledge base for a grounded
            answer to relay to the caller.
          </p>
        )}
        {history.map((en, i) => (
          <div key={i} className="exchange">
            <div className="bubble user">{en.question}</div>
            {en.loading && <div className="bubble assistant loading">Thinking…</div>}
            {en.error && <div className="bubble assistant error">{en.error}</div>}
            {en.response && (
              <div className="bubble assistant">
                <div className="answer">{en.response.answer}</div>
                {en.response.sources.length > 0 && (
                  <div className="sources">
                    <span className="sources-label">Sources:</span>
                    {en.response.sources.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <form className="composer" onSubmit={submit}>
        <input
          type="text"
          placeholder="What is the caller asking about?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit">Ask</button>
      </form>
    </div>
  )
}
