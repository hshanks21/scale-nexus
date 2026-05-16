import React, { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { FolderTree } from '../components/sidebar/FolderTree'
import { FileList } from '../components/main/FileList'

export function BrowsePage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId)
  }

  return (
    <AppLayout
      sidebar={
        <FolderTree
          selectedFolder={selectedFolder}
          onFolderSelect={handleFolderSelect}
        />
      }
    >
      <FileList
        selectedFolder={selectedFolder}
        onFolderSelect={handleFolderSelect}
      />
    </AppLayout>
  )
}
