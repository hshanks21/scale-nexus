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
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ 
        flexShrink: 0, 
        transition: 'transform 150ms ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)'
      }}
    >
      <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FolderIcon({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      stroke={active ? '#2563eb' : '#9ca3af'}
      style={{ flexShrink: 0 }}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}

function FolderItem({ 
  node, level, selectedFolder, expandedFolders, onFolderSelect, onToggleExpanded 
}: {
  node: FolderNode; level: number; selectedFolder: string | null;
  expandedFolders: Set<string>; onFolderSelect: (id: string) => void;
  onToggleExpanded: (id: string) => void;
}) {
  const navigate = useNavigate()
  const isExpanded = expandedFolders.has(node.id)
  const isSelected = selectedFolder === node.id
  const isClient = level === 0 && node.type === 'folder'
  
  const handleClick = () => {
    if (node.type === 'folder') {
      onToggleExpanded(node.id)
      onFolderSelect(node.id)
    } else if (node.type === 'document' && node.documentId) {
      navigate(`/documents/${node.documentId}`)
    }
  }

  // Client-level items render as section headers
  if (isClient) {
    return (
      <div style={{ marginTop: level === 0 ? '0' : '24px' }}>
        <div
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 20px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600,
            color: '#9ca3af',
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
          }}
        >
          <ChevronIcon expanded={isExpanded} />
          <span>{node.name}</span>
        </div>
        {node.children && isExpanded && (
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

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          paddingLeft: `${20 + (level - 1) * 20}px`,
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: isSelected ? 500 : 400,
          color: isSelected ? '#2563eb' : '#374151',
          backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
          borderRadius: '0',
          transition: 'background-color 100ms ease',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb'
        }}
        onMouseLeave={(e) => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
        }}
      >
        {node.type === 'folder' && <ChevronIcon expanded={isExpanded} />}
        {node.type === 'folder' ? <FolderIcon active={isSelected} /> : <FileIcon />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {node.name}
        </span>
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['stg', 'stg-sow', 'stg-sow-2026']))

  const handleToggleExpanded = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) next.delete(folderId)
      else next.add(folderId)
      return next
    })
  }

  return (
    <nav>
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
