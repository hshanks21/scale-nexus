import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Topbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
        <h1 
          className="text-xl text-black font-normal"
          style={{ fontFamily: 'Playfair Display' }}
        >
          NEXUS
        </h1>
        {/* TODO: Search bar can be added later */}
      </div>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebar && (
          <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
            {sidebar}
          </div>
        )}
        
        {/* Main panel */}
        <div className="flex-1 bg-white p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
