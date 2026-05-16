import React from 'react'
import { useParams } from 'react-router'
import { OriginTopbar } from '../components/layout/OriginTopbar'
import { MetadataStrip } from '../components/origin/MetadataStrip'
import { VersionTimeline } from '../components/origin/VersionTimeline'
import { DocumentCard } from '../components/origin/DocumentCard'
import { useDocument } from '../hooks/useDocument'
import { mockDocuments } from '../lib/mockData'

export function DocumentPage() {
  const { id } = useParams<{ id: string }>()
  const { document, loading, error } = useDocument(id!)
  
  // Get related documents (same category, excluding current)
  const relatedDocs = mockDocuments
    .filter(doc => doc.id !== id && doc.category === document?.category)
    .slice(0, 3)

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download document:', document?.title)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="origin-body">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="origin-heading mb-4" style={{ color: 'var(--color-origin-ink)' }}>
            Document Not Found
          </h2>
          <p className="origin-body" style={{ color: 'var(--color-origin-body)' }}>
            {error || 'The document you requested could not be found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: 'var(--color-origin-surface)' }}>
      <OriginTopbar title={document.title} onDownload={handleDownload} />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Main document card */}
        <div 
          className="bg-white rounded-lg border p-8 mb-8"
          style={{ borderColor: 'var(--color-origin-border)' }}
        >
          {/* Document header */}
          <header className="mb-8">
            <h1 className="origin-heading text-3xl mb-4" style={{ color: 'var(--color-origin-ink)' }}>
              {document.title}
            </h1>
            <MetadataStrip document={document} />
          </header>

          {/* Document content */}
          <div className="prose max-w-none">
            {document.content ? (
              <div className="origin-body leading-relaxed" style={{ color: 'var(--color-origin-ink)' }}>
                {/* For now, show content as plain text. In production, this would be markdown or PDF */}
                <p>{document.content}</p>
                <p className="mt-6 text-gray-500">
                  [Document content would be rendered here - either as formatted markdown or embedded PDF]
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div 
                  className="w-24 h-32 mx-auto mb-4 border-2 border-dashed rounded-lg flex items-center justify-center"
                  style={{ borderColor: 'var(--color-origin-border)' }}
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="origin-body" style={{ color: 'var(--color-origin-body)' }}>
                  Document content not available for preview
                </p>
              </div>
            )}
          </div>

          {/* Version timeline */}
          {document.versions && document.versions.length > 0 && (
            <VersionTimeline versions={document.versions} />
          )}
        </div>

        {/* Related documents */}
        {relatedDocs.length > 0 && (
          <section>
            <h2 className="origin-heading mb-6" style={{ color: 'var(--color-origin-ink)' }}>
              Related {document.category} Documents
            </h2>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {relatedDocs.map((relatedDoc) => (
                <div key={relatedDoc.id} className="flex-none w-80">
                  <DocumentCard document={relatedDoc} size="small" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
