import React from 'react'
import { useSearchParams } from 'react-router'
import { WiredMasthead } from '../components/layout/WiredMasthead'
import { StoryCard } from '../components/wired/StoryCard'
import { StoryRow } from '../components/wired/StoryRow'
import { useDocuments } from '../hooks/useDocuments'

export function BrowsePage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined
  const { documents, loading, error } = useDocuments(category)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="wired-body">Loading documents...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="wired-story mb-4" style={{ color: 'var(--color-wired-ink)' }}>
            Error Loading Documents
          </h2>
          <p className="wired-body" style={{ color: 'var(--color-wired-body)' }}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  const featuredDoc = documents[0]
  const secondaryDocs = documents.slice(1, 3)
  const remainingDocs = documents.slice(3)

  return (
    <div className="min-h-screen bg-white">
      <WiredMasthead activeCategory={category} showSearch />
      
      <main className="max-w-7xl mx-auto px-6">
        {/* Hero section */}
        <section className="py-12 text-center">
          <h1 className="wired-hero mb-4" style={{ color: 'var(--color-wired-ink)' }}>
            {category ? `${category} Documents` : 'Document Repository'}
          </h1>
          <p className="wired-body max-w-2xl mx-auto" style={{ color: 'var(--color-wired-body)' }}>
            {category 
              ? `Browse all ${category.toLowerCase()} documents and resources`
              : 'Comprehensive collection of business documents, contracts, reports, and whitepapers'
            }
          </p>
        </section>

        {/* Magazine grid */}
        {!category && documents.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Featured story */}
              {featuredDoc && (
                <div className="lg:col-span-1">
                  <StoryCard document={featuredDoc} featured />
                </div>
              )}
              
              {/* Secondary stories */}
              <div className="space-y-4">
                {secondaryDocs.map((doc) => (
                  <StoryCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Document listing */}
        <section className="pb-16">
          {category && (
            <h2 className="wired-section mb-8" style={{ color: 'var(--color-wired-ink)' }}>
              All {category} Documents
            </h2>
          )}
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="wired-story mb-4" style={{ color: 'var(--color-wired-ink)' }}>
                No Documents Found
              </h3>
              <p className="wired-body" style={{ color: 'var(--color-wired-body)' }}>
                {category 
                  ? `No ${category.toLowerCase()} documents are available.`
                  : 'No documents are available at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {(category ? documents : remainingDocs).map((document) => (
                <StoryRow key={document.id} document={document} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
