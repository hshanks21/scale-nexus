import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

interface WiredMastheadProps {
  activeCategory?: string
  showSearch?: boolean
}

export function WiredMasthead({ activeCategory, showSearch = false }: WiredMastheadProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white border-b" style={{ borderColor: 'var(--color-wired-hairline)' }}>
      {/* Main masthead */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-black no-underline">
            <h1 className="wired-nav" style={{ color: 'var(--color-wired-ink)' }}>
              NEXUS
            </h1>
          </Link>

          {/* Search (if enabled) */}
          {showSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-0 border-b-2 bg-transparent focus:outline-none focus:border-black origin-body"
                style={{ 
                  borderColor: 'var(--color-wired-hairline)',
                  color: 'var(--color-wired-ink)'
                }}
              />
            </form>
          )}
        </div>
      </div>

      {/* Category navigation */}
      <nav className="px-6 py-3 bg-white" style={{ backgroundColor: 'var(--color-wired-canvas-soft)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {['SOW', 'Contract', 'Report', 'Whitepaper'].map((category) => (
              <Link
                key={category}
                to={activeCategory === category ? '/' : `/?category=${category}`}
                className={
                  `wired-nav text-decoration-none ${
                    activeCategory === category
                      ? 'border-b-2 border-black'
                      : 'hover:opacity-70'
                  }`
                }
                style={{ 
                  color: 'var(--color-wired-ink)',
                  paddingBottom: '8px'
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
