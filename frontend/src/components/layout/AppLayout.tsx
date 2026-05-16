import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Topbar */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-6" style={{ borderColor: '#e5e5e5' }}>
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span className="text-base font-medium" style={{ color: '#1a1a1a', letterSpacing: '-0.01em' }}>Nexus</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-9 pr-4 py-1.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-1"
              style={{ borderColor: '#e5e5e5', width: '240px', color: '#1a1a1a' }}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-60 bg-white border-r flex-shrink-0 overflow-y-auto" style={{ borderColor: '#e5e5e5' }}>
            {sidebar}
          </aside>
        )}
        
        {/* Main panel */}
        <main className="flex-1 bg-white overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
