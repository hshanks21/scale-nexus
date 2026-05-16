/**
 * Document Tools — MCP tools for document operations
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db.js';
import { getPresignedUrl } from '../lib/s3.js';

export function registerDocumentTools(server: McpServer) {

  // ── Search Documents ─────────────────────────────────────────
  server.tool(
    'search_documents',
    'Search documents by query, client_id, business_types, topic_ids, area_id. Uses MongoDB text search.',
    {
      query: z.string().optional().describe('Free-text search query'),
      client_id: z.string().default('STG').describe('Client ID filter'),
      business_types: z.array(z.string()).optional().describe('Filter by business types (SOW, PO, etc.)'),
      topic_ids: z.array(z.string()).optional().describe('Filter by topic IDs'),
      area_id: z.string().optional().describe('Filter by area ID'),
      include_archived: z.boolean().default(false).describe('Include archived documents'),
      latest_only: z.boolean().default(true).describe('Only return latest versions'),
      limit: z.number().min(1).max(100).default(20).describe('Maximum number of results'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
    },
    async ({ 
      query, 
      client_id, 
      business_types, 
      topic_ids, 
      area_id,
      include_archived,
      latest_only,
      limit,
      offset 
    }) => {
      const db = getDb();
      const collection = db.collection('documents');
      
      // Build MongoDB filter
      const filter: any = {};
      
      if (client_id) filter.client_id = client_id;
      if (!include_archived) filter.archived = { $ne: true };
      if (latest_only) filter.is_latest = true;
      if (area_id) filter.area_id = area_id;
      if (topic_ids && topic_ids.length > 0) {
        filter.topic_ids = { $in: topic_ids };
      }
      if (business_types && business_types.length > 0) {
        filter.business_type = { $in: business_types };
      }
      
      // Add text search if query provided
      if (query) {
        filter.$or = [
          { $text: { $search: query } },
          { name: { $regex: query, $options: 'i' } },
          { business_type: { $regex: query, $options: 'i' } }
        ];
      }
      
      // Execute query with pagination
      const documents = await collection
        .find(filter)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .toArray();
      
      const total = await collection.countDocuments(filter);
      
      // Transform to DocumentSummary format
      const summaries = documents.map(doc => ({
        id: doc.id,
        version: doc.version,
        name: doc.name,
        business_type: doc.business_type,
        client_id: doc.client_id,
        s3_text_path: doc.s3_text_path,
        topic_titles: doc.topic_titles || [],
        area_id: doc.area_id,
        created_at: doc.created_at,
        created_by: doc.created_by,
        is_latest: doc.is_latest,
        total_versions: 1, // TODO: calculate actual count
        metadata: doc.metadata || []
      }));
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            documents: summaries,
            total: total
          }, null, 2),
        }],
      };
    }
  );

  // ── Get Document ─────────────────────────────────────────
  server.tool(
    'get_document',
    'Get document by ID with optional version. Returns full document metadata + presigned S3 URLs.',
    {
      id: z.string().describe('Document UUID'),
      version: z.number().optional().describe('Document version (omit for latest)'),
      presigned_ttl: z.number().default(3600).describe('Presigned URL TTL in seconds'),
    },
    async ({ id, version, presigned_ttl }) => {
      const db = getDb();
      const collection = db.collection('documents');
      
      // Build query
      const query: any = { id };
      if (version) {
        query.version = version;
      } else {
        query.is_latest = true;
      }
      
      const document = await collection.findOne(query);
      if (!document) {
        throw new Error(`Document not found: ${id}${version ? ` v${version}` : ''}`);
      }
      
      // Generate presigned URLs for S3 paths
      let textPresignedUrl = '';
      let rawPresignedUrl = '';
      
      try {
        if (document.s3_text_path) {
          // Extract object path from s3://bucket/path format
          const textPath = document.s3_text_path.replace(/^s3:\/\/[^\/]+\//, '');
          textPresignedUrl = await getPresignedUrl(textPath, presigned_ttl);
        }
        
        if (document.s3_raw_path) {
          const rawPath = document.s3_raw_path.replace(/^s3:\/\/[^\/]+\//, '');
          rawPresignedUrl = await getPresignedUrl(rawPath, presigned_ttl);
        }
      } catch (error) {
        console.error('Failed to generate presigned URLs:', error);
      }
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            document: document,
            text_presigned_url: textPresignedUrl,
            raw_presigned_url: rawPresignedUrl
          }, null, 2),
        }],
      };
    }
  );

  // ── List Documents ─────────────────────────────────────────
  server.tool(
    'list_documents',
    'List documents with filters, pagination, and sorting.',
    {
      client_id: z.string().default('STG').describe('Client ID filter'),
      business_types: z.array(z.string()).optional().describe('Filter by business types'),
      area_id: z.string().optional().describe('Filter by area ID'),
      topic_ids: z.array(z.string()).optional().describe('Filter by topic IDs'),
      include_archived: z.boolean().default(false).describe('Include archived documents'),
      latest_only: z.boolean().default(true).describe('Only return latest versions'),
      limit: z.number().min(1).max(100).default(20).describe('Maximum number of results'),
      offset: z.number().min(0).default(0).describe('Pagination offset'),
      sort_by: z.enum(['created_at', 'name', 'business_type']).default('created_at').describe('Sort field'),
      descending: z.boolean().default(true).describe('Sort descending'),
    },
    async ({ 
      client_id, 
      business_types, 
      area_id, 
      topic_ids,
      include_archived,
      latest_only,
      limit,
      offset,
      sort_by,
      descending
    }) => {
      const db = getDb();
      const collection = db.collection('documents');
      
      // Build filter (same as search_documents but without text search)
      const filter: any = {};
      
      if (client_id) filter.client_id = client_id;
      if (!include_archived) filter.archived = { $ne: true };
      if (latest_only) filter.is_latest = true;
      if (area_id) filter.area_id = area_id;
      if (topic_ids && topic_ids.length > 0) {
        filter.topic_ids = { $in: topic_ids };
      }
      if (business_types && business_types.length > 0) {
        filter.business_type = { $in: business_types };
      }
      
      // Build sort
      const sort: any = {};
      sort[sort_by] = descending ? -1 : 1;
      
      const documents = await collection
        .find(filter)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        .toArray();
      
      const total = await collection.countDocuments(filter);
      
      // Transform to DocumentSummary format
      const summaries = documents.map(doc => ({
        id: doc.id,
        version: doc.version,
        name: doc.name,
        business_type: doc.business_type,
        client_id: doc.client_id,
        s3_text_path: doc.s3_text_path,
        topic_titles: doc.topic_titles || [],
        area_id: doc.area_id,
        created_at: doc.created_at,
        created_by: doc.created_by,
        is_latest: doc.is_latest,
        total_versions: 1, // TODO: calculate actual count
        metadata: doc.metadata || []
      }));
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            documents: summaries,
            total: total
          }, null, 2),
        }],
      };
    }
  );

  // ── List Document Versions ─────────────────────────────────────────
  server.tool(
    'list_document_versions',
    'List all versions of a document by ID.',
    {
      id: z.string().describe('Document UUID'),
    },
    async ({ id }) => {
      const db = getDb();
      const collection = db.collection('documents');
      
      const versions = await collection
        .find({ id })
        .sort({ version: 1 })
        .toArray();
      
      if (versions.length === 0) {
        throw new Error(`Document not found: ${id}`);
      }
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            document_versions: versions,
            total: versions.length
          }, null, 2),
        }],
      };
    }
  );

  // ── Ingest Document ─────────────────────────────────────────
  server.tool(
    'ingest_document',
    'Create a new document or new version. NOTE: For Phase 1, raw_content (PDF bytes) is NOT handled yet.',
    {
      name: z.string().describe('Display name for the document'),
      business_type: z.string().describe('Document type: SOW, PO, Whitepaper, Contract, Report'),
      client_id: z.string().default('STG').describe('Client ID'),
      mime_type: z.string().default('application/pdf').describe('MIME type'),
      topic_names: z.array(z.string()).optional().describe('Topic names (will create topics if missing)'),
      area_id: z.string().optional().describe('Area ID'),
      created_by: z.string().describe('Creator identifier: user@context'),
      metadata: z.array(z.object({
        name: z.string(),
        type: z.string(),
        value: z.string()
      })).default([]).describe('Metadata key-value pairs'),
      supersede_doc_id: z.string().optional().describe('If set, creates new version of existing document'),
      version_note: z.string().default('Initial version').describe('Version change description'),
    },
    async ({ 
      name, 
      business_type, 
      client_id, 
      mime_type,
      topic_names,
      area_id,
      created_by,
      metadata,
      supersede_doc_id,
      version_note
    }) => {
      const db = getDb();
      const collection = db.collection('documents');
      const now = Date.now();
      const year = new Date().getFullYear();
      
      let docId: string;
      let version: number = 1;
      
      if (supersede_doc_id) {
        // Creating new version of existing document
        docId = supersede_doc_id;
        
        // Get latest version
        const latestDoc = await collection.findOne({ 
          id: supersede_doc_id, 
          is_latest: true 
        });
        
        if (!latestDoc) {
          throw new Error(`Document not found for versioning: ${supersede_doc_id}`);
        }
        
        version = latestDoc.version + 1;
        
        // Mark previous version as not latest
        await collection.updateOne(
          { id: supersede_doc_id, is_latest: true },
          { $set: { is_latest: false } }
        );
      } else {
        // Creating new document
        docId = uuidv4();
      }
      
      // Generate S3 paths
      // Derive extension from mime_type
      const extMap: Record<string, string> = {
        "application/pdf": ".pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/vnd.ms-excel": ".xls",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
        "text/markdown": ".md",
        "image/jpeg": ".jpg",
        "image/png": ".png",
      };
      const ext = extMap[mime_type] || ".bin";
      const s3RawPath = `s3://nova-vault/${client_id}/${year}/raw/${docId}/v${version}${ext}`;
      const s3TextPath = `s3://nova-vault/${client_id}/${year}/text/${docId}/v${version}.md`;
      
      // Create document record
      const document = {
        id: docId,
        version: version,
        previous_version_id: supersede_doc_id && version > 1 ? supersede_doc_id : null,
        name: name,
        kind: 'knowledge',
        mime_type: mime_type,
        business_type: business_type,
        client_id: client_id,
        s3_raw_path: s3RawPath,
        s3_text_path: s3TextPath,
        topic_ids: topic_names || [], // TODO: resolve topic names to IDs
        area_id: area_id,
        is_latest: true,
        created_at: now,
        created_by: created_by,
        modified_at: now,
        modified_by: created_by,
        metadata: metadata,
        version_history: [{
          version: version,
          note: version_note,
          changed_by: created_by,
          changed_at: now
        }],
        archived: false
      };
      
      await collection.insertOne(document);
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            document: document,
            message: `Document created: ${docId} v${version}`
          }, null, 2),
        }],
      };
    }
  );
}
