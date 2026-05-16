import React from 'react'
import { useSearchParams } from 'react-router'
import { WiredMasthead } from '../components/layout/WiredMasthead'
import { StoryRow } from '../components/wired/StoryRow'
import { useSearch } from '../hooks/useDocuments'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { results, loading, error } = useSearch(query)

  if (loading) {
    return (
      <div className="min-h-screen">
        <WiredMasthead showSearch />
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="wired-body">Searching documents...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <WiredMasthead showSearch />
      
      <main className="max-w-7xl mx-auto px-6">
        {/* Search header */}
        <section className="py-12">
          <h1 className="wired-hero mb-4" style={{ color: 'var(--color-wired-ink)' }}>
            Search Results
          </h1>
          {query && (
            <p className="wired-body" style={{ color: 'var(--color-wired-body)' }}>
              Showing results for "<em>{query}</em>"
            </p>
          )}
        </section>

        {/* Results */}
        <section className="pb-16">
          {error ? (
            <div className="text-center py-12">
              <h3 className="wired-story mb-4" style={{ color: 'var(--color-wired-ink)' }}>
                Search Error
              </h3>
              <p className="wired-body" style={{ color: 'var(--color-wired-body)' }}>
                {error}
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="wired-story mb-4" style={{ color: 'var(--color-wired-ink)' }}>
                No Results Found
              </h3>
              <p className="wired-body" style={{ color: 'var(--color-wired-body)' }}>
                {query 
                  ? `No documents found matching "${query}". Try different keywords or browse by category.`
                  : 'Enter a search term to find documents.'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="wired-nav" style={{ color: 'var(--color-wired-body)' }}>
                  {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'} FOUND
                </p>
              </div>
              <div className="space-y-0">
                {results.map((document) => (
                  <StoryRow key={document.id} document={document} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
