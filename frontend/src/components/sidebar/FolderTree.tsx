import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { folderTree, FolderNode } from '../../lib/mockData'

interface FolderTreeProps {
  selectedFolder: string | null
  onFolderSelect: (folderId: string) => void
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 12 12" fill="none"
      className={"transition-transform duration-150 " + (expanded ? "rotate-90" : "")}
      style={{ flexShrink: 0, marginLeft: '-2px' }}
    >
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}

function FolderItem({ 
  node, level, selectedFolder, expandedFolders, onFolderSelect, onToggleExpanded 
}: {
  node: FolderNode, level: number, selectedFolder: string | null,
  expandedFolders: Set<string>, onFolderSelect: (id: string) => void,
  onToggleExpanded: (id: string) => void
}) {
  const navigate = useNavigate()
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFolder === node.id
  
  const handleClick = () => {
    if (node.type === 'folder') {
      onToggleExpanded(node.id)
      onFolderSelect(node.id)
    } else if (node.type === 'document' && node.documentId) {
      navigate("/documents/" + node.documentId)
    }
  }

  // Determine if this is a top-level client node
  const isClient = level === 0 && node.type === 'folder'

  return (
    <div>
      <div
        className={"flex items-center gap-2 cursor-pointer transition-colors duration-150 "
          + (isSelected ? "" : "hover:bg-gray-50 ")}
        style={{
          padding: '8px 16px',
          paddingLeft: (16 + level * 20) + 'px',
          fontSize: isClient ? '11px' : '14px',
          fontWeight: isClient ? 600 : (isSelected ? 500 : 400),
          color: isClient ? '#6b6b6b' : '#1a1a1a',
          letterSpacing: isClient ? '0.05em' : 'normal',
          textTransform: isClient ? 'uppercase' as const : 'none' as const,
          backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
        }}
        onClick={handleClick}
      >
        {node.type === 'folder' && <ChevronIcon expanded={isExpanded} />}
        {!isClient && (node.type === 'folder' ? <FolderIcon /> : <FileIcon />)}
        <span className="truncate">{node.name}</span>
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['stg']))

  const handleToggleExpanded = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) next.delete(folderId)
      else next.add(folderId)
      return next
    })
  }

  return (
    <nav className="py-4 px-2">
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
    </nav>
  )
}
