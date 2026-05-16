import React from 'react'
import { Link } from 'react-router'
import { Document } from '../../lib/mockData'
import { CategoryEyebrow } from './CategoryEyebrow'

interface StoryCardProps {
  document: Document
  featured?: boolean
}

export function StoryCard({ document, featured = false }: StoryCardProps) {
  const cardHeight = featured ? 'h-80' : 'h-48'
  
  return (
    <Link 
      to={`/documents/${document.id}`}
      className="block group no-underline"
      style={{ color: 'inherit' }}
    >
      <article className={`${cardHeight} flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent relative overflow-hidden`}>
        {/* Background placeholder */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"
          style={{ backgroundColor: 'var(--color-wired-canvas-soft)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 text-white">
          <CategoryEyebrow 
            category={document.category} 
            className="text-white/80 mb-2"
          />
          <h2 className={`${featured ? 'wired-section' : 'wired-story'} mb-3 group-hover:opacity-90 transition-opacity`}>
            {document.title}
          </h2>
          <p className="wired-body text-white/90">
            By {document.author} · {new Date(document.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </article>
    </Link>
  )
}
