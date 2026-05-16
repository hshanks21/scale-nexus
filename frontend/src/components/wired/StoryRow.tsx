import React from 'react'
import { Link } from 'react-router'
import { Document } from '../../lib/mockData'
import { CategoryEyebrow } from './CategoryEyebrow'

interface StoryRowProps {
  document: Document
}

export function StoryRow({ document }: StoryRowProps) {
  return (
    <Link 
      to={`/documents/${document.id}`}
      className="block group no-underline"
      style={{ color: 'inherit' }}
    >
      <article className="py-6 border-t" style={{ borderColor: 'var(--color-wired-hairline)' }}>
        <CategoryEyebrow category={document.category} className="mb-2" />
        <h2 className="wired-story mb-2 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--color-wired-ink)' }}>
          {document.title}
        </h2>
        <p className="wired-body" style={{ color: 'var(--color-wired-body)' }}>
          By {document.author} · {new Date(document.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </article>
    </Link>
  )
}
