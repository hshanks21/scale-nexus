# Nexus Architecture — Multi-User / Shared Memory for Agents

> **Status:** Draft — in design phase
> **Last updated:** 2026-05-14

---

## What Is Nexus?

Nexus is a universal file cache and knowledge graph for Scale agents (Scale-Nexus). It sits in front of S3 and catalogs every document generated or ingested by Fulcrum, My Scale, and Scout — making that content retrievable by any future agent without burning tokens to recreate it.

**Core principle:** Agents store in Nexus instead of regenerating. Every expensive task run once becomes cheap thereafter.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         AGENTS                                   │
│   Scout          Fulcrum          My Scale        Future agents  │
└────────┬─────────────┬──────────────────┬──────────────────────┘
         │             │                  │
         ▼             ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Nexus MCP Server (SSE)                        │
│  SearchDocuments  GetDocument  ListDocuments  IngestDocument    │
└────────┬────────────────┬─────────────────────┬─────────────────┘
         │                │                     │
         ▼                ▼                     ▼
┌─────────────────┐  ┌──────────────┐  ┌─────────────────────────┐
│   MongoDB Atlas  │  │  MinIO S3    │  │  Supabase Auth           │
│  (metadata only)│  │  (all files) │  │  (user identity + API key)│
└─────────────────┘  └──────────────┘  └─────────────────────────┘
```

---

## Data Flow

### Document Origins

| Producer | Action | S3 Storage | Markdown Sidecar |
|----------|--------|------------|-----------------|
| Fulcrum | Generates quote/SOW PDF | `/{clientId}/{year}/raw/{docId}.pdf` | None |
| My Scale | Generates QBR PDF | `/{clientId}/{year}/raw/{docId}.pdf` | None |
| Scout | Generates business intel doc | `/{clientId}/{year}/raw/{docId}.pdf` | `/{clientId}/{year}/text/{docId}.md` (MarkItDown) |
| Any agent | Uploads arbitrary file (LiveOptics, etc.) | `/{clientId}/{year}/files/{docId}/{name}` | None |

### The Agent Loop (RAG Pattern)

```
User asks → "recon on Cohesity"
     ↓
Agent calls Nexus MCP → SearchDocuments(query="Cohesity")
     ↓
Found in Nexus? → YES → retrieve markdown (cheap) or PDF → provide answer
                 NO → perform expensive task → store result in Nexus → done
```

Every agent across every tool checks Nexus first. The more it's used, the smarter it becomes — expensive tasks run once, cached forever.

---

## S3 Path Structure

```
{clientId}/{year}/raw/{docId}.pdf       ← all raw files (PDFs, generated docs)
{clientId}/{year}/text/{docId}.md        ← Scout-generated markdown sidecar only
{clientId}/{year}/files/{docId}/{name}  ← agent-uploaded arbitrary files
```

### Path Variables

- `{clientId}` — "STG" default, else specific client (e.g., "AIT", "AcmeCorp")
- `{year}` — four-digit year (e.g., "2026")
- `{docId}` — UUID of the document
- `{name}` — original filename for agent-uploaded files

---

## MongoDB Schema

MongoDB holds **metadata only** — no document content. Agents read content from S3 via presigned URLs.

### Collections

**documents** — primary collection
```
{
  _id: ObjectId,
  id: string,              // UUID — exposed to agents
  kind: string,           // "knowledge" | "binary"
  mime_type: string,      // "text/markdown" | "application/pdf" | "image/jpeg"
  name: string,           // display name
  business_type: string,  // "SOW" | "PO" | "Whitepaper" | "Contract" | "Report" | "LiveOptics"
  client_id: string,      // "STG" default
  s3_raw_path: string,    // s3://{bucket}/{clientId}/{year}/raw/{docId}.pdf
  s3_text_path: string,   // s3://{bucket}/{clientId}/{year}/text/{docId}.md (Scout only)
  s3_files_path: string,  // s3://{bucket}/{clientId}/{year}/files/{docId}/
  topic_ids: [string],    // refs to Topic._id
  area_id: string,        // ref to Area._id
  superseded_by: string,  // UUID of replacement doc
  superseded: bool,       // soft filter — hidden unless include_archived
  created_at: int64,      // Unix timestamp
  created_by: string,     // "hshanks@scout", "rmoran@fulcrum", "harold@nexus"
  modified_at: int64,
  modified_by: string,
  metadata: [             // key/value pairs: department, contract_value, expires_at
    { name: string, type: string, value: string }
  ],
  archived: bool          // soft-delete
}
```

**topics** — knowledge graph nodes
```
{
  _id: ObjectId,
  id: string,            // UUID
  name: string,          // slug, e.g. "managed-services"
  title: string,         // display name, e.g. "Managed Services"
  description: string,
  document_ids: [string],// denormalized — fast graph traversal
  created_at: int64,
  created_by: string
}
```

**areas** — organizational buckets
```
{
  _id: ObjectId,
  id: string,
  name: string,          // slug
  title: string,         // display name
  color: string,        // hex for UI badges, e.g. "#0D2C2C"
  created_at: int64
}
```

**clients** — tenant separation
```
{
  _id: ObjectId,
  id: string,            // "STG", "AIT", etc.
  name: string,          // "Scale Technology Group"
  active: bool,
  created_at: int64,
  created_by: string
}
```

---

## MCP Server Tools

Agents call these tools via SSE:

### SearchDocuments
```json
{
  "query": "Cohesity backup recon",
  "client_id": "STG",
  "business_types": ["Report", "Whitepaper"],
  "topic_ids": ["uuid"],
  "area_id": "uuid",
  "include_archived": false,
  "limit": 20,
  "offset": 0
}
```
Returns `DocumentSummary[]` — metadata only, no file content.

### GetDocument
```json
{ "id": "uuid", "presigned_ttl": 3600 }
```
Returns full `Document` metadata + presigned S3 URLs for raw and text paths.

### ListDocuments
```json
{
  "client_id": "STG",
  "business_types": ["SOW", "PO"],
  "area_id": "uuid",
  "topic_ids": ["uuid"],
  "include_archived": false,
  "limit": 20,
  "offset": 0,
  "sort_by": "created_at",
  "descending": true
}
```

### IngestDocument (Scout only)
```json
{
  "name": "Cohesity Helios Recon 2026-05-14",
  "business_type": "Report",
  "client_id": "STG",
  "raw_content": "<base64 PDF>",
  "mime_type": "application/pdf",
  "topic_names": ["cohesity", "backup"],
  "area_id": "uuid",
  "created_by": "scout@recon",
  "metadata": [
    { "name": "platform", "type": "string", "value": "Cohesity Helios" }
  ],
  "supersede_doc_id": "uuid"  // optional — mark old doc as superseded
}
```
Flow: Scout uploads PDF → MCP server runs MarkItDown → S3 stores both files → MongoDB catalogs metadata.

---

## API Endpoints (REST — for backend-to-backend writes)

```
POST /api/documents          — Fulcrum/MyScale write metadata (they upload to S3 directly)
GET  /api/documents/search   — SearchDocuments (REST alternative to MCP)
GET  /api/documents/:id      — GetDocument (REST alternative to MCP)
GET  /api/documents          — ListDocuments
POST /api/documents/:id/files — agents upload arbitrary files (LiveOptics, etc.)
GET  /api/documents/:id/files/:name — retrieve agent-uploaded file (presigned URL)
POST /api/ingest             — Scout ingest (triggers MarkItDown + S3 write)
```

---

## Auth

- **Supabase Auth** — human users (Nexus frontend, Fulcrum/MyScale users)
- **API Key (`X-Api-Key`)** — agents (Scout, future agents), validated server-side
- **Client isolation** — `client_id` in every document query enforces tenant separation

---

## Infrastructure

| Component | Provider | Notes |
|-----------|----------|-------|
| MongoDB | Atlas (M0 free tier for dev) | Connection string in `MONGODB_URI` |
| S3 / Object Storage | MinIO (existing at 192.168.2.40:9000) | nova-vault bucket |
| Auth | Supabase | Same project as Fulcrum/My Scale |
| MCP Server | nexus-mcp (separate VM) | SSE mode, Node 22 + Python 3.10+ |
| Frontend | Nexus (existing) | Rebuilt with auth + multi-tenancy |

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Markdown storage | S3 only (not MongoDB) | Agents read from S3 via presigned URLs; MongoDB holds metadata only |
| MarkItDown scope | Scout only | Fulcrum/MyScale PDFs pulled from DB don't need conversion; Scout generates new content that benefits from markdown sidecar |
| Document content | Not in MongoDB | MongoDB is the index, S3 is the content store |
| S3 path structure | `/{clientId}/{year}/...` | Natural archival by year + client isolation at the path level |
| Agent writes | API key auth | Service-to-service auth without Supabase JWT overhead |
| Client isolation | `client_id` on every query | Multi-tenant — each client sees only their documents |
| Superseeded chain | `superseded_by` UUID | Version chain for doc evolution without deletion |
| Semantic search | Skip at launch | Full-text search in MongoDB adequate; Supabase pgvector for future embedding-based retrieval |

---

## Roadmap

- [ ] Create Atlas cluster → `MONGODB_URI` in Doppler
- [ ] nexus-mcp server scaffold (SSE mode, Node 22 + Python 3.10+)
- [ ] MarkItDown ingest pipeline (Scout only)
- [ ] Nexus write API (POST /api/documents, POST /api/ingest, POST /api/documents/{id}/files)
- [ ] Nexus query API (SearchDocuments, GetDocument, ListDocuments)
- [ ] Nexus frontend rebuild (auth, browse, multi-tenancy)
- [ ] Scout integration (API key auth, MarkItDown sidecar)
- [ ] Fulcrum → Nexus write flow (backend uploads to S3, calls Nexus API)
- [ ] My Scale → Nexus write flow
- [ ] Supabase pgvector for semantic search (future)
- [ ] Mattermost bot (presigned S3 links to end-users)

---

## Reference

- Proto schema: `docs/nexus.proto`
- Design system: `DESIGN.md`
- Repo: git@github.com:hshanks21/nexus.git


## Schema Strategy

The protobuf schema (nexus.proto) is used **only as a schema design artifact**:
- At build time: proto-loader generates TypeScript types from nexus.proto
- At runtime: REST JSON over HTTPS — no protobuf wire format
- In storage: MongoDB stores documents as JSON

Protobuf wire format is not used at any point in the data flow. The proto file is the single source of truth for field names, types, and structure — everything downstream is JSON.


### Versioning

Every version of a document is preserved forever. No files are ever deleted.

- Each version is a new MongoDB record with its own S3 paths
- S3 paths include version: 
- Document fields: , , , 
- Default search:  — only current versions returned
- Ingest with  → creates new version of existing doc
- Ingest without → creates new document (version 1)
- No file ever overwritten or deleted


## Build Phases

### Phase 1 — MCP Core (MVP)
**Goal:** Make document storage and retrieval work for agents via MCP.

Deliverables:
- nexus-mcp server on SSE (port 3003)
- MongoDB Atlas connected, document/topic/area collections
- MinIO S3 integration (upload, presigned URLs)
- MCP tools: IngestDocument, SearchDocuments, GetDocument, ListDocuments
- Scout API key auth (X-Api-Key)
- All env vars in Doppler (MONGODB_URI, MINIO_*, SUPABASE_*, NEXUS_API_KEY)

### Phase 2 — Web UI (Wired zone)
**Goal:** Human staff can browse, search, and read documents.

Deliverables:
- Nexus frontend (React) with Wired editorial aesthetic
- Document browser: magazine grid, category filters, full-text search
- Auth: Supabase Auth
- Document detail view (Origin zone: clean, white, rounded)
- Version history display

### Phase 3 — Scout Integration + MarkItDown
**Goal:** Agents generate content that lands in Nexus.

Deliverables:
- Scout calls IngestDocument via API key
- MarkItDown runs on MCP server (Python sidecar)
- Markdown sidecar stored alongside PDF in S3
- Superseeded chain for versioning

### Phase 4 — Fulcrum/My Scale Writes
**Goal:** Generated documents from both apps land in Nexus.

Deliverables:
- Fulcrum backend: on quote/SOW save -> upload to S3 -> POST /api/documents
- My Scale backend: on QBR generate -> same pattern

### Phase 5 — Mattermost Bot
**Goal:** Staff query Nexus from Mattermost.

Deliverables:
- Mattermost bot receives messages
- Calls MCP tools, posts results back to channel
