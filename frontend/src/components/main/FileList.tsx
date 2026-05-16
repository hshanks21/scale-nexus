import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { 
  clients, Client, Document,
  getDocumentsByArea, getDocumentsByClient, getRecentDocuments, mockDocuments 
} from '../../lib/mockData'

interface FileListProps {
  activeNav: string | null
  onClientSelect?: (clientId: string) => void
}

function FileIcon() {
  return (
    <div style={{ 
      width: '36px', height: '36px', borderRadius: '8px',
      backgroundColor: '#f0f4ff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    </div>
  )
}

function ClientIcon() {
  return (
    <div style={{ 
      width: '36px', height: '36px', borderRadius: '8px',
      backgroundColor: '#f5f5f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  )
}

function DocumentRow({ doc, onClick }: { doc: Document; onClick: () => void }) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        transition: 'all 100ms ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb';
        (e.currentTarget as HTMLElement).style.borderColor = '#e5e5e5';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
        (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0';
      }}
    >
      <FileIcon />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontSize: '14px', fontWeight: 500, color: '#1a1a1a',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {doc.title}
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#9ca3af', marginTop: '3px'
        }}>
          <span>{doc.author}</span>
          <span>·</span>
          <span>{formatDate(doc.date)}</span>
          {doc.client && (
            <>
              <span>·</span>
              <span>{doc.client}</span>
            </>
          )}
        </div>
      </div>
      <span style={{ 
        fontSize: '11px', fontWeight: 500,
        padding: '4px 8px', borderRadius: '4px',
        backgroundColor: '#f5f5f5', color: '#6b6b6b',
        flexShrink: 0
      }}>
        {doc.category}
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────
// Client List View
// ─────────────────────────────────────────

function ClientListView({ onClientSelect }: { onClientSelect: (name: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = search 
    ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : clients

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '360px',
            padding: '10px 14px',
            fontSize: '13px',
            borderRadius: '8px',
            border: '1px solid #e8e8e8',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            outline: 'none',
          }}
        />
      </div>

      {/* Client grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
        {filtered.map(client => (
          <div
            key={client.id}
            onClick={() => onClientSelect(client.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              border: '1px solid #f0f0f0',
              transition: 'all 100ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb';
              (e.currentTarget as HTMLElement).style.borderColor = '#e5e5e5';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
              (e.currentTarget as HTMLElement).style.borderColor = '#f0f0f0';
            }}
          >
            <ClientIcon />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{client.name}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                {client.documentCount} documents
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Document List View
// ─────────────────────────────────────────

function DocumentListView({ documents, title }: { documents: Document[]; title?: string }) {
  const navigate = useNavigate()
  
  return (
    <div>
      {title && (
        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {documents.map(doc => (
          <DocumentRow 
            key={doc.id} 
            doc={doc} 
            onClick={() => navigate(`/documents/${doc.id}`)} 
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Home View
// ─────────────────────────────────────────

function HomeView() {
  const navigate = useNavigate()
  const recent = getRecentDocuments()
  
  return (
    <div>
      <p style={{ fontSize: '15px', color: '#6b6b6b', marginBottom: '32px' }}>
        Welcome back. Here are your recently modified documents.
      </p>
      
      <div style={{ marginBottom: '12px' }}>
        <span style={{ 
          fontSize: '11px', fontWeight: 600, color: '#9ca3af', 
          letterSpacing: '0.06em', textTransform: 'uppercase' as const 
        }}>
          Recent Activity
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {recent.map(doc => (
          <DocumentRow 
            key={doc.id} 
            doc={doc} 
            onClick={() => navigate(`/documents/${doc.id}`)} 
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Main Export
// ───────���─────────────────────────────────

export function FileList({ activeNav }: FileListProps) {
  const navigate = useNavigate()
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  // Labels for each view
  const viewTitles: Record<string, string> = {
    home: 'Home',
    clients: 'Clients',
    internal: 'Internal Documents',
    sales: 'Sales Documents',
    engineering: 'Engineering Documents',
    recent: 'Recently Viewed',
  }

  const title = activeNav ? viewTitles[activeNav] || '' : 'Home'

  // Determine what to render
  const renderContent = () => {
    if (!activeNav || activeNav === 'home') {
      return <HomeView />
    }

    if (activeNav === 'clients' && !selectedClient) {
      return <ClientListView onClientSelect={(name) => setSelectedClient(name)} />
    }

    if (activeNav === 'clients' && selectedClient) {
      const docs = getDocumentsByClient(selectedClient)
      return (
        <div>
          <button
            onClick={() => setSelectedClient(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', color: '#6b6b6b', cursor: 'pointer',
              background: 'none', border: 'none', padding: '0',
              marginBottom: '16px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to clients
          </button>
          <DocumentListView documents={docs} title={selectedClient} />
        </div>
      )
    }

    if (activeNav === 'recent') {
      return <DocumentListView documents={getRecentDocuments()} />
    }

    // Area views (internal, sales, engineering)
    const docs = getDocumentsByArea(activeNav)
    return <DocumentListView documents={docs} title={title} />
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Page title */}
      <h1 style={{ 
        fontSize: '22px', fontWeight: 600, color: '#1a1a1a', 
        margin: '0 0 24px', letterSpacing: '-0.02em'
      }}>
        {activeNav === 'clients' && selectedClient ? selectedClient : title}
      </h1>

      {renderContent()}
    </div>
  )
}
