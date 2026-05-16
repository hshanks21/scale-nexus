import React, { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { FolderTree } from '../components/sidebar/FolderTree'
import { FileList } from '../components/main/FileList'

export function BrowsePage() {
  const [activeNav, setActiveNav] = useState<string | null>('home')

  return (
    <AppLayout
      sidebar={
        <FolderTree
          activeItem={activeNav}
          onItemSelect={(id) => setActiveNav(id)}
        />
      }
    >
      <FileList activeNav={activeNav} />
    </AppLayout>
  )
}
