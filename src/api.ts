const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8080'

export interface HealthResponse {
  status: string
  documents: number
  sources: string[]
  embed_model: string
}

export interface SearchResult {
  source: string
  score: number
  text: string
}

export interface Passage {
  source: string
  score: number
}

export interface AskResponse {
  answer: string
  sources: string[]
  passages: Passage[]
}

export interface IngestResponse {
  ingested_chunks: number
  documents: number
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  return (await res.json()) as T
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return (await res.json()) as HealthResponse
}

export function ask(question: string, topK?: number): Promise<AskResponse> {
  return postJson<AskResponse>('/ask', { question, top_k: topK ?? null })
}

export function search(
  question: string,
  topK?: number,
): Promise<{ results: SearchResult[] }> {
  return postJson<{ results: SearchResult[] }>('/search', {
    question,
    top_k: topK ?? null,
  })
}

export function ingestPath(path: string): Promise<IngestResponse> {
  return postJson<IngestResponse>('/ingest/path', { path })
}

export async function ingestUpload(file: File): Promise<IngestResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/ingest/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  return (await res.json()) as IngestResponse
}

export { API_BASE }
