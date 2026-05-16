/**
 * Topic Tools — MCP tools for topic operations
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../lib/db.js';

export function registerTopicTools(server: McpServer) {

  // ── List Topics ─────────────────────────────────────────
  server.tool(
    'list_topics',
    'List all topics in the knowledge graph.',
    {},
    async () => {
      const db = getDb();
      const collection = db.collection('topics');
      
      const topics = await collection
        .find({})
        .sort({ title: 1 })
        .toArray();
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            topics: topics
          }, null, 2),
        }],
      };
    }
  );

  // ── Create Topic ─────────────────────────────────────────
  server.tool(
    'create_topic',
    'Create a new topic in the knowledge graph.',
    {
      name: z.string().describe('Topic slug (e.g., managed-services)'),
      title: z.string().describe('Display name (e.g., Managed Services)'),
      description: z.string().optional().describe('Topic description'),
    },
    async ({ name, title, description }) => {
      const db = getDb();
      const collection = db.collection('topics');
      
      // Check if topic already exists
      const existing = await collection.findOne({ name });
      if (existing) {
        throw new Error(`Topic already exists: ${name}`);
      }
      
      const topic = {
        id: uuidv4(),
        name: name,
        title: title,
        description: description || '',
        document_ids: [],
        created_at: Date.now(),
        created_by: 'system' // TODO: get from context
      };
      
      await collection.insertOne(topic);
      
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            topic: topic,
            message: `Topic created: ${title}`
          }, null, 2),
        }],
      };
    }
  );
}
