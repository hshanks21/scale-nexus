import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Topbar */}
      <header 
        className="flex items-center justify-between flex-shrink-0"
        style={{ 
          height: '64px', 
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#ffffff'
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ 
            width: '32px', height: '32px', 
            backgroundColor: '#1a1a1a', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            Nexus
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <svg 
              className="absolute top-1/2 -translate-y-1/2" 
              style={{ left: '12px' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              style={{ 
                width: '260px',
                padding: '8px 12px 8px 38px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                backgroundColor: '#fafafa',
                color: '#1a1a1a',
                outline: 'none',
              }}
            />
          </div>
          <div 
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              backgroundColor: '#f0f0f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <aside 
            className="flex-shrink-0 overflow-y-auto"
            style={{ 
              width: '248px', 
              backgroundColor: '#ffffff',
              borderRight: '1px solid #f0f0f0',
              padding: '20px 0'
            }}
          >
            {sidebar}
          </aside>
        )}
        
        {/* Main panel */}
        <main 
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: '#fafafa' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
