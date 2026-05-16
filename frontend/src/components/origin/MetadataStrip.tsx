import React from 'react'
import { Document } from '../../lib/mockData'

interface MetadataStripProps {
  document: Document
}

export function MetadataStrip({ document }: MetadataStripProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'SOW': 'bg-blue-50 text-blue-700 border-blue-200',
      'Contract': 'bg-green-50 text-green-700 border-green-200',
      'Report': 'bg-purple-50 text-purple-700 border-purple-200',
      'Whitepaper': 'bg-orange-50 text-orange-700 border-orange-200',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className="flex items-center space-x-3 text-sm">
      {/* Category badge */}
      <span className={`origin-label px-2 py-1 rounded border ${getCategoryColor(document.category)}`}>
        {document.category}
      </span>
      
      {/* Client (if available) */}
      {document.client && (
        <>
          <span className="text-gray-300">·</span>
          <span className="origin-label" style={{ color: 'var(--color-origin-body)' }}>
            {document.client}
          </span>
        </>
      )}
      
      {/* Date */}
      <span className="text-gray-300">·</span>
      <span className="origin-label" style={{ color: 'var(--color-origin-body)' }}>
        {new Date(document.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}
      </span>
      
      {/* Author */}
      <span className="text-gray-300">·</span>
      <span className="origin-label" style={{ color: 'var(--color-origin-body)' }}>
        {document.author}
      </span>
    </div>
  )
}
