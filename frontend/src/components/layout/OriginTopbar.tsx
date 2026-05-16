import React from 'react'
import { Link } from 'react-router'

interface OriginTopbarProps {
  title: string
  onDownload?: () => void
}

export function OriginTopbar({ title, onDownload }: OriginTopbarProps) {
  return (
    <header className="bg-white border-b px-6 py-4" style={{ borderColor: 'var(--color-origin-border)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - back button and title */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 no-underline"
            style={{ color: 'var(--color-origin-body)' }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="origin-label">Back</span>
          </Link>
          <h1 className="origin-heading" style={{ color: 'var(--color-origin-ink)' }}>
            {title}
          </h1>
        </div>

        {/* Right side - actions */}
        <div className="flex items-center space-x-3">
          {onDownload && (
            <button
              onClick={onDownload}
              className="origin-button px-4 py-2 bg-transparent border hover:bg-gray-50"
              style={{ 
                borderColor: 'var(--color-origin-border)',
                color: 'var(--color-origin-ink)'
              }}
            >
              Download
            </button>
          )}
          <button
            className="origin-button px-4 py-2"
            style={{ 
              backgroundColor: 'var(--color-origin-accent)',
              color: 'white',
              border: 'none'
            }}
          >
            Share
          </button>
        </div>
      </div>
    </header>
  )
}
