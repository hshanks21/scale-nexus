import { Document, getDocuments, getDocument, searchDocuments } from './mockData'

// Base API configuration
const API_BASE_URL = '/api' // Will be configured for MCP server later

// Fetch wrapper for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
}

// Document API functions
export const documentsApi = {
  // List documents with optional category filter
  async list(category?: string): Promise<Document[]> {
    // For now, return mock data
    // TODO: Replace with real API call
    // return apiCall<Document[]>(`/documents${category ? `?category=${category}` : ''}`)
    return getDocuments(category)
  },

  // Get single document by ID
  async get(id: string): Promise<Document | null> {
    // For now, return mock data
    // TODO: Replace with real API call
    // return apiCall<Document>(`/documents/${id}`)
    const doc = getDocument(id)
    return doc || null
  },

  // Get document versions
  async getVersions(id: string): Promise<Array<{ id: string; version: string; date: string; author: string }>> {
    // For now, return mock data
    // TODO: Replace with real API call
    // return apiCall<Array<{ id: string; version: string; date: string; author: string }>>(`/documents/${id}/versions`)
    const doc = getDocument(id)
    return doc?.versions || []
  },

  // Search documents
  async search(query: string): Promise<Document[]> {
    // For now, return mock data
    // TODO: Replace with real API call
    // return apiCall<Document[]>(`/search?q=${encodeURIComponent(query)}`)
    return searchDocuments(query)
  },
}
