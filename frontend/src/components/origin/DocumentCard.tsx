import React from 'react'
import { Link } from 'react-router'
import { Document } from '../../lib/mockData'
import { MetadataStrip } from './MetadataStrip'

interface DocumentCardProps {
  document: Document
  size?: 'small' | 'medium'
}

export function DocumentCard({ document, size = 'medium' }: DocumentCardProps) {
  const cardClass = size === 'small' ? 'p-4' : 'p-6'
  const titleClass = size === 'small' ? 'origin-body font-semibold' : 'origin-heading'
  
  return (
    <Link 
      to={`/documents/${document.id}`}
      className="block group no-underline"
      style={{ color: 'inherit' }}
    >
      <article 
        className={`${cardClass} bg-white border rounded-lg hover:shadow-sm transition-shadow`}
        style={{ borderColor: 'var(--color-origin-border)' }}
      >
        <h3 className={`${titleClass} mb-3 group-hover:text-blue-600 transition-colors`} style={{ color: 'var(--color-origin-ink)' }}>
          {document.title}
        </h3>
        
        <MetadataStrip document={document} />
        
        {document.content && (
          <p className="origin-body mt-3 text-gray-600 line-clamp-2" style={{ color: 'var(--color-origin-body)' }}>
            {document.content.substring(0, 120)}...
          </p>
        )}
      </article>
    </Link>
  )
}
