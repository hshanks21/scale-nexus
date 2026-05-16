export interface Document {
  id: string
  title: string
  category: 'SOW' | 'Contract' | 'Report' | 'Whitepaper'
  department: string
  client?: string
  author: string
  date: string
  content?: string
  versions?: Array<{
    id: string
    version: string
    date: string
    author: string
  }>
}

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Acme Corp Statement of Work',
    category: 'SOW',
    department: 'Engineering',
    client: 'Acme Corp',
    author: 'Sarah Chen',
    date: '2026-03-15',
    content: 'This statement of work outlines the technical requirements and deliverables for the Acme Corp project...',
    versions: [
      { id: '1-v1', version: '1.0', date: '2026-03-15', author: 'Sarah Chen' },
      { id: '1-v2', version: '1.1', date: '2026-03-10', author: 'Sarah Chen' }
    ]
  },
  {
    id: '2',
    title: 'Q1 2026 Quarterly Business Review',
    category: 'Report',
    department: 'Sales',
    author: 'Michael Rodriguez',
    date: '2026-04-01',
    content: 'Comprehensive review of Q1 2026 business performance, including sales metrics, customer acquisition...'
  },
  {
    id: '3',
    title: 'Managed Services Contract',
    category: 'Contract',
    department: 'Operations',
    client: 'TechStart Inc',
    author: 'Lisa Wang',
    date: '2026-01-10',
    content: 'Service level agreement for ongoing managed services including network monitoring...'
  },
  {
    id: '4',
    title: 'Cloud Migration Whitepaper',
    category: 'Whitepaper',
    department: 'Engineering',
    author: 'David Kim',
    date: '2026-02-20',
    content: 'Strategic analysis of cloud migration options and recommendations for enterprise clients...'
  },
  {
    id: '5',
    title: 'Network Assessment Report',
    category: 'Report',
    department: 'Engineering',
    client: 'Global Manufacturing',
    author: 'Jennifer Adams',
    date: '2026-05-01',
    content: 'Detailed technical assessment of network infrastructure and security recommendations...'
  },
  {
    id: '6',
    title: 'AIT Service Agreement',
    category: 'Contract',
    department: 'Operations',
    client: 'AIT',
    author: 'Robert Taylor',
    date: '2026-04-15',
    content: 'Comprehensive service agreement covering support, maintenance, and service level commitments...'
  }
]

export const getDocuments = (category?: string): Document[] => {
  if (!category) return mockDocuments
  return mockDocuments.filter(doc => doc.category === category)
}

export const getDocument = (id: string): Document | undefined => {
  return mockDocuments.find(doc => doc.id === id)
}

export const searchDocuments = (query: string): Document[] => {
  const lowercaseQuery = query.toLowerCase()
  return mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(lowercaseQuery) ||
    doc.category.toLowerCase().includes(lowercaseQuery) ||
    doc.department.toLowerCase().includes(lowercaseQuery) ||
    doc.author.toLowerCase().includes(lowercaseQuery) ||
    (doc.client && doc.client.toLowerCase().includes(lowercaseQuery))
  )
}
