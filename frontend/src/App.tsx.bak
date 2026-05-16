import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthGuard } from './components/layout/AuthGuard'
import { LoginPage } from './pages/LoginPage'
import { BrowsePage } from './pages/BrowsePage'
import { DocumentPage } from './pages/DocumentPage'
import { SearchPage } from './pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <AuthGuard>
            <BrowsePage />
          </AuthGuard>
        } />
        <Route path="/documents/:id" element={
          <AuthGuard>
            <DocumentPage />
          </AuthGuard>
        } />
        <Route path="/search" element={
          <AuthGuard>
            <SearchPage />
          </AuthGuard>
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={
          <AuthGuard>
            <BrowsePage />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
