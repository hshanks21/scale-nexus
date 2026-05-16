import { useState, useEffect } from 'react'
import { Document, documentsApi } from '../lib/api'

export function useDocuments(category?: string) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)
        const docs = await documentsApi.list(category)
        setDocuments(docs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch documents')
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [category])

  return { documents, loading, error }
}

export function useDocument(id: string) {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        setError(null)
        const doc = await documentsApi.get(id)
        setDocument(doc)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch document')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDocument()
    }
  }, [id])

  return { document, loading, error }
}

export function useSearch(query: string) {
  const [results, setResults] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchDocuments = async () => {
      try {
        setLoading(true)
        setError(null)
        const searchResults = await documentsApi.search(query)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchDocuments, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return { results, loading, error }
}
