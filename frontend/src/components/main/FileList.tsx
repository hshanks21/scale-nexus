import React from 'react'
import { useNavigate } from 'react-router'
import { findFolderNode, getFolderPath, getDocument, FolderNode } from '../../lib/mockData'

interface FileListProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

export function FileList({ selectedFolder, onFolderSelect }: FileListProps) {
  const navigate = useNavigate()
  
  if (!selectedFolder) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Inter' }}>Select a folder</h3>
          <p className="text-sm" style={{ fontFamily: 'Inter' }}>Choose a folder from the sidebar to view its contents</p>
        </div>
      </div>
    )
  }

  const folderNode = findFolderNode(selectedFolder)
  
  if (!folderNode) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Inter' }}>Folder not found</h3>
        </div>
      </div>
    )
  }

  const breadcrumbPath = getFolderPath(selectedFolder)
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div>
      {/* Breadcrumb */}
      {breadcrumbPath.length > 0 && (
        <div className="mb-6">
          <nav className="text-sm text-gray-600" style={{ fontFamily: 'Inter' }}>
            {breadcrumbPath.join(' > ')}
          </nav>
        </div>
      )}

      {/* Content */}
      {contents.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p className="text-sm" style={{ fontFamily: 'Inter' }}>This folder is empty</p>
        </div>
      ) : (
        <div className="space-y-0">
          {contents.map((item) => {
            const document = item.type === 'document' && item.documentId ? getDocument(item.documentId) : null
            
            return (
              <div
                key={item.id}
                className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="mr-3 text-lg">
                  {item.type === 'folder' ? '📁' : '📄'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 
                      className="text-sm font-medium text-gray-900 truncate"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {item.name}
                    </h3>
                    
                    {document && (
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        style={{ fontFamily: 'Inter' }}
                      >
                        {document.category}
                      </span>
                    )}
                  </div>
                  
                  {document && (
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>
                      <span>{formatDate(document.date)}</span>
                      <span>{document.author}</span>
                      {document.client && <span>Client: {document.client}</span>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
