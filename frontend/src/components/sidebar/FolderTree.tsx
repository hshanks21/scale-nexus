import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { folderTree, FolderNode } from '../../lib/mockData'

interface FolderTreeProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

interface FolderItemProps {
  node: FolderNode
  level: number
  selectedFolder: string | null
  expandedFolders: Set<string>
  onFolderSelect: (folderId: string) => void
  onToggleExpanded: (folderId: string) => void
}

function FolderItem({ 
  node, 
  level, 
  selectedFolder, 
  expandedFolders, 
  onFolderSelect, 
  onToggleExpanded 
}: FolderItemProps) {
  const navigate = useNavigate()
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFolder === node.id
  
  const handleClick = () => {
    if (node.type === 'folder') {
      if (node.children && node.children.length > 0) {
        onToggleExpanded(node.id)
      }
      onFolderSelect(node.id)
    } else if (node.type === 'document' && node.documentId) {
      navigate(`/documents/${node.documentId}`)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm ${
          isSelected ? 'bg-blue-50 font-medium' : ''
        }`}
        style={{ 
          paddingLeft: `${12 + level * 16}px`,
          fontFamily: 'Inter'
        }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? '📁' : '📄'} 
        <span className="ml-2">{node.name}</span>
      </div>
      
      {node.type === 'folder' && node.children && isExpanded && (
        <div>
          {node.children.map((child) => (
            <FolderItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedFolder={selectedFolder}
              expandedFolders={expandedFolders}
              onFolderSelect={onFolderSelect}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({ selectedFolder, onFolderSelect }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['stg', 'ait']))

  const handleToggleExpanded = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="py-4">
        {folderTree.map((node) => (
          <FolderItem
            key={node.id}
            node={node}
            level={0}
            selectedFolder={selectedFolder}
            expandedFolders={expandedFolders}
            onFolderSelect={onFolderSelect}
            onToggleExpanded={handleToggleExpanded}
          />
        ))}
      </div>
    </div>
  )
}
