import React from 'react'
import { useNavigate } from 'react-router'
import { findFolderNode, getFolderPath, getDocument, FolderNode } from '../../lib/mockData'

interface FileListProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
}

export function FileList({ selectedFolder, onFolderSelect }: FileListProps) {
  const navigate = useNavigate()
  
  if (!selectedFolder) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: '#6b6b6b' }}>
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Select a folder</p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Choose a folder from the sidebar to browse documents</p>
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
      navigate("/documents/" + item.documentId)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '13px', color: '#6b6b6b' }}>
        {breadcrumbParts.map((part, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2.5L8 6L4.5 9.5" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span>{part}</span>
          </span>
        ))}
      </div>

      {/* Folder title */}
      <h2 className="text-xl font-semibold mb-6" style={{ color: '#1a1a1a', letterSpacing: '-0.01em' }}>{folderNode.name}</h2>

      {contents.length === 0 ? (
        <p className="text-sm" style={{ color: '#9ca3af' }}>This folder is empty</p>
      ) : (
        <div className="space-y-2">
          {contents.map((item) => {
            const doc = item.type === 'document' && item.documentId ? getDocument(item.documentId) : null

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-150 hover:bg-gray-50 rounded-lg border"
                style={{ borderColor: '#e5e5e5' }}
                onClick={() => handleItemClick(item)}
              >
                <div style={{ flexShrink: 0 }}>
                  {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                    {item.name}
                  </div>
                  {doc && (
                    <div className="flex items-center gap-4 mt-1" style={{ fontSize: '13px', color: '#9ca3af' }}>
                      <span>{doc.author}</span>
                      <span>•</span>
                      <span>{formatDate(doc.date)}</span>
                      {doc.client && (
                        <>
                          <span>•</span>
                          <span>{doc.client}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {doc && (
                  <span
                    className="px-3 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#6b6b6b',
                      fontSize: '12px',
                      flexShrink: 0
                    }}
                  >
                    {doc.category}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
