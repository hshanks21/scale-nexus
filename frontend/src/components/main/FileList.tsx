import React from 'react'
import { useNavigate } from 'react-router'
import { findFolderNode, getFolderPath, getDocument, FolderNode } from '../../lib/mockData'

interface FileListProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

function FolderIconLarge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function FileIconLarge() {
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

export function FileList({ selectedFolder, onFolderSelect }: FileListProps) {
  const navigate = useNavigate()
  
  if (!selectedFolder) {
    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        height: '100%', padding: '40px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '16px',
            backgroundColor: '#f5f5f5', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px' }}>
            Select a folder
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            Choose a folder from the sidebar to browse documents
          </p>
        </div>
      </div>
    )
  }

  const folderNode = findFolderNode(selectedFolder)
  if (!folderNode) return null

  const breadcrumbParts = getFolderPath(selectedFolder)
  const contents = folderNode.children || []

  const handleItemClick = (item: FolderNode) => {
    if (item.type === 'folder') {
      onFolderSelect(item.id)
    } else if (item.type === 'document' && item.documentId) {
      navigate(`/documents/${item.documentId}`)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Breadcrumb */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', color: '#9ca3af', marginBottom: '8px'
      }}>
        {breadcrumbParts.map((part, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {i > 0 && <span style={{ color: '#d4d4d4' }}>/</span>}
            <span>{part}</span>
          </span>
        ))}
      </div>

      {/* Section title */}
      <h1 style={{ 
        fontSize: '22px', fontWeight: 600, color: '#1a1a1a', 
        margin: '0 0 24px', letterSpacing: '-0.02em'
      }}>
        {folderNode.name}
      </h1>

      {contents.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>This folder is empty</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {contents.map((item) => {
            const doc = item.type === 'document' && item.documentId ? getDocument(item.documentId) : null
            
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
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
                {item.type === 'folder' ? (
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FolderIconLarge />
                  </div>
                ) : (
                  <FileIconLarge />
                )}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '14px', fontWeight: 500, color: '#1a1a1a',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {item.name}
                  </div>
                  {doc && (
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
                  )}
                </div>

                {doc && (
                  <span style={{ 
                    fontSize: '11px', fontWeight: 500,
                    padding: '4px 8px', borderRadius: '4px',
                    backgroundColor: '#f5f5f5', color: '#6b6b6b',
                    flexShrink: 0
                  }}>
                    {doc.category}
                  </span>
                )}

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
