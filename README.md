# Scale-Nexus

Universal file cache and knowledge graph for Scale agents. Every document created by Fulcrum, My Scale, or Scout is stored in S3 and cataloged in MongoDB — making it retrievable by any future agent without burning tokens to recreate it.

**Core principle:** Agents store in Nexus instead of regenerating. Every expensive task run once becomes cheap forever.

## Docs

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — full system design, data flows, API
- [nexus.proto](docs/nexus.proto) — protobuf schema (source of truth)
- [docs/diagrams/](docs/diagrams/) — system diagrams

## Architecture

```
Scout · Fulcrum · My Scale → Nexus MCP → MongoDB Atlas + MinIO S3
                              ↑
                    Agent Query Loop (RAG)
```

## Status

**Design phase** — architecture locked, Atlas cluster pending.
