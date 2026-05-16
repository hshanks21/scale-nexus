import React from 'react'
import { navSections, NavItem } from '../../lib/mockData'

interface SidebarNavProps {
  activeItem: string | null
  onItemSelect: (itemId: string) => void
}

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? '#2563eb' : '#6b6b6b'
  
  switch (type) {
    case 'home':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    case 'clients':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    case 'internal':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      )
    case 'sales':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    case 'engineering':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      )
    case 'recent':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      )
    default:
      return null
  }
}

export function FolderTree({ activeItem, onItemSelect }: SidebarNavProps) {
  return (
    <nav>
      {navSections.map((section) => (
        <div key={section.id} style={{ marginBottom: '24px' }}>
          {/* Section header */}
          <div style={{
            padding: '0 20px',
            marginBottom: '8px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#9ca3af',
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
          }}>
            {section.label}
          </div>
          
          {/* Section items */}
          <div>
            {section.items.map((item) => {
              const isActive = activeItem === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => onItemSelect(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#2563eb' : '#374151',
                    backgroundColor: isActive ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                    borderRight: isActive ? '2px solid #2563eb' : '2px solid transparent',
                    transition: 'all 100ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  <NavIcon type={item.icon} active={isActive} />
                  <span>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
