// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface Document {
  id: string
  title: string
  category: 'SOW' | 'Contract' | 'Report' | 'Whitepaper' | 'Runbook' | 'Architecture' | 'Proposal'
  area: 'clients' | 'internal' | 'sales' | 'engineering'
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

export interface NavItem {
  id: string
  label: string
  icon: 'clients' | 'internal' | 'sales' | 'engineering' | 'recent' | 'home'
  area?: string
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

// ─────────────────────────────────────────
// Navigation structure
// ─────────────────────────────────────────

export const navSections: NavSection[] = [
  {
    id: 'navigate',
    label: 'NAVIGATE',
    items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'clients', label: 'Clients', icon: 'clients', area: 'clients' },
      { id: 'internal', label: 'Internal', icon: 'internal', area: 'internal' },
      { id: 'sales', label: 'Sales', icon: 'sales', area: 'sales' },
      { id: 'engineering', label: 'Engineering', icon: 'engineering', area: 'engineering' },
    ]
  },
  {
    id: 'recent',
    label: 'RECENT',
    items: [
      { id: 'recent', label: 'Recently Viewed', icon: 'recent' },
    ]
  }
]

// ─────────────────────────────────────────
// Client list
// ─────────────────────────────────────────

export interface Client {
  id: string
  name: string
  documentCount: number
}

export const clients: Client[] = [
  { id: 'acme', name: 'Acme Corp', documentCount: 8 },
  { id: 'ait', name: 'AIT Solutions', documentCount: 4 },
  { id: 'techstart', name: 'TechStart Inc', documentCount: 6 },
  { id: 'meridian', name: 'Meridian Health', documentCount: 3 },
  { id: 'blueridge', name: 'Blue Ridge Manufacturing', documentCount: 5 },
  { id: 'summit', name: 'Summit Financial', documentCount: 7 },
  { id: 'cascade', name: 'Cascade Systems', documentCount: 2 },
  { id: 'northpoint', name: 'Northpoint Energy', documentCount: 4 },
]

// ─────────────────────────────────────────
// Documents
// ─────────────────────────────────────────

export const mockDocuments: Document[] = [
  // Client docs
  {
    id: '1',
    title: 'Acme Corp Statement of Work',
    category: 'SOW',
    area: 'clients',
    department: 'Engineering',
    client: 'Acme Corp',
    author: 'Sarah Chen',
    date: '2026-03-15',
    content: 'This statement of work outlines the technical requirements and deliverables for the Acme Corp project...',
    versions: [
      { id: '1-v2', version: '2.0', date: '2026-03-15', author: 'Sarah Chen' },
      { id: '1-v1', version: '1.0', date: '2026-02-20', author: 'Sarah Chen' },
    ]
  },
  {
    id: '2',
    title: 'Q1 2026 Quarterly Business Review',
    category: 'Report',
    area: 'clients',
    department: 'Sales',
    client: 'Acme Corp',
    author: 'Mike Johnson',
    date: '2026-04-01',
    content: 'Quarterly review of services delivered to Acme Corp...',
  },
  {
    id: '3',
    title: 'Managed Services Contract',
    category: 'Contract',
    area: 'clients',
    department: 'Operations',
    client: 'TechStart Inc',
    author: 'Lisa Wang',
    date: '2026-01-10',
  },
  {
    id: '4',
    title: 'AIT Service Agreement',
    category: 'Contract',
    area: 'clients',
    department: 'Operations',
    client: 'AIT Solutions',
    author: 'David Park',
    date: '2026-04-15',
  },
  {
    id: '5',
    title: 'Network Assessment Report',
    category: 'Report',
    area: 'clients',
    department: 'Engineering',
    client: 'Meridian Health',
    author: 'James Rodriguez',
    date: '2026-05-01',
  },
  // Internal docs
  {
    id: '10',
    title: 'Platform Architecture Overview',
    category: 'Architecture',
    area: 'internal',
    department: 'Engineering',
    author: 'Harold Shanks',
    date: '2026-04-20',
  },
  {
    id: '11',
    title: 'Incident Response Runbook',
    category: 'Runbook',
    area: 'internal',
    department: 'Operations',
    author: 'Patrick Liu',
    date: '2026-03-05',
  },
  {
    id: '12',
    title: 'Onboarding Checklist',
    category: 'Runbook',
    area: 'internal',
    department: 'Operations',
    author: 'Sarah Chen',
    date: '2026-02-14',
  },
  // Sales docs
  {
    id: '20',
    title: 'Managed Services Proposal Template',
    category: 'Proposal',
    area: 'sales',
    department: 'Sales',
    author: 'Mike Johnson',
    date: '2026-01-20',
  },
  {
    id: '21',
    title: 'Cloud Migration Whitepaper',
    category: 'Whitepaper',
    area: 'sales',
    department: 'Engineering',
    author: 'Harold Shanks',
    date: '2026-02-20',
  },
  // Engineering docs
  {
    id: '30',
    title: 'Backup Strategy Documentation',
    category: 'Architecture',
    area: 'engineering',
    department: 'Engineering',
    author: 'James Rodriguez',
    date: '2026-04-10',
  },
  {
    id: '31',
    title: 'Network Standards Guide',
    category: 'Architecture',
    area: 'engineering',
    department: 'Engineering',
    author: 'Patrick Liu',
    date: '2026-03-22',
  },
]

// ─────────────────────────────────────────
// Query helpers
// ─────────────────────────────────────────

export const getDocuments = (category?: string): Document[] => {
  if (!category) return mockDocuments
  return mockDocuments.filter(d => d.category === category)
}

export const getDocumentsByArea = (area: string): Document[] => {
  return mockDocuments.filter(d => d.area === area)
}

export const getDocumentsByClient = (clientName: string): Document[] => {
  return mockDocuments.filter(d => d.client === clientName)
}

export const getDocument = (id: string): Document | undefined => {
  return mockDocuments.find(d => d.id === id)
}

export const searchDocuments = (query: string): Document[] => {
  const lower = query.toLowerCase()
  return mockDocuments.filter(d =>
    d.title.toLowerCase().includes(lower) ||
    d.category.toLowerCase().includes(lower) ||
    d.author.toLowerCase().includes(lower) ||
    (d.client && d.client.toLowerCase().includes(lower))
  )
}

export const getRecentDocuments = (): Document[] => {
  return [...mockDocuments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
}

// Legacy exports for compatibility
export interface FolderNode {
  id: string
  name: string
  type: 'folder' | 'document'
  children?: FolderNode[]
  documentId?: string
}
export const folderTree: FolderNode[] = []
export const findFolderNode = (id: string): FolderNode | null => null
export const getFolderPath = (id: string): string[] => []
