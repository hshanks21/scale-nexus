import React from 'react'

interface Version {
  id: string
  version: string
  date: string
  author: string
}

interface VersionTimelineProps {
  versions: Version[]
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  if (!versions.length) return null

  return (
    <section className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-origin-border)' }}>
      <h3 className="origin-heading mb-4" style={{ color: 'var(--color-origin-ink)' }}>
        Version History
      </h3>
      
      <div className="space-y-4">
        {versions.map((version, index) => (
          <div key={version.id} className="flex items-start space-x-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                style={{ 
                  backgroundColor: index === 0 ? 'var(--color-origin-accent)' : 'var(--color-origin-border)'
                }}
              />
              {index < versions.length - 1 && (
                <div 
                  className="w-px h-8 mt-2"
                  style={{ backgroundColor: 'var(--color-origin-border)' }}
                />
              )}
            </div>
            
            {/* Version details */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <span className="origin-label font-medium" style={{ color: 'var(--color-origin-ink)' }}>
                  Version {version.version}
                  {index === 0 && (
                    <span 
                      className="ml-2 px-2 py-1 text-xs rounded"
                      style={{ 
                        backgroundColor: 'var(--color-origin-selected)',
                        color: 'var(--color-origin-accent)'
                      }}
                    >
                      Current
                    </span>
                  )}
                </span>
                <button 
                  className="origin-caption hover:underline"
                  style={{ color: 'var(--color-origin-accent)' }}
                >
                  View
                </button>
              </div>
              <div className="origin-caption mt-1" style={{ color: 'var(--color-origin-body)' }}>
                {version.author} · {new Date(version.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
