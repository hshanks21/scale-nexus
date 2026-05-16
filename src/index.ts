/**
 * Scale-Nexus MCP Server
 * 
 * Document repository and knowledge graph for Scale agents.
 * Provides tools for storing and retrieving documents with
 * MongoDB Atlas metadata and MinIO S3 file storage.
 * 
 * Transports:
 *   - stdio: agent on same machine (default)
 *   - SSE:   agent on different machine (set MCP_TRANSPORT=sse)
 */

import { config } from 'dotenv';
config(); // Load environment variables

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createServer } from 'http';
import { connectToDatabase } from './lib/db.js';
import { ensureBucket } from './lib/s3.js';
import { validateApiKey, sendAuthError } from './lib/auth.js';
import { registerDocumentTools } from './tools/documents.js';
import { registerTopicTools } from './tools/topics.js';

const server = new McpServer({
  name: 'scale-nexus',
  version: '1.0.0',
});

// Initialize database and S3
await connectToDatabase();
await ensureBucket();

// Register all tools
registerDocumentTools(server);
registerTopicTools(server);

// Start server
const transport = process.env.MCP_TRANSPORT || 'stdio';

if (transport === 'sse') {
  const port = parseInt(process.env.MCP_PORT || '3003', 10);
  const sessions = new Map<string, SSEServerTransport>();

  const httpServer = createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://localhost:${port}`);

    // Health check
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'ok', 
        server: 'scale-nexus-mcp', 
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Authentication for non-health endpoints
    if (!validateApiKey(req)) {
      sendAuthError(res);
      return;
    }

    // SSE endpoint — client connects here for events
    if (url.pathname === '/sse' && req.method === 'GET') {
      const sseTransport = new SSEServerTransport('/messages', res);
      sessions.set(sseTransport.sessionId, sseTransport);

      res.on('close', () => {
        sessions.delete(sseTransport.sessionId);
      });

      await server.connect(sseTransport);
      return;
    }

    // Message endpoint — client sends tool calls here
    if (url.pathname === '/messages' && req.method === 'POST') {
      const sessionId = url.searchParams.get('sessionId');
      if (!sessionId || !sessions.has(sessionId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid or missing sessionId' }));
        return;
      }

      const sseTransport = sessions.get(sessionId)!;
      await sseTransport.handlePostMessage(req, res);
      return;
    }

    // Not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  httpServer.listen(port, () => {
    console.log(`🧵 Scale-Nexus MCP Server (SSE) running on port ${port}`);
    console.log(`   Health: http://localhost:${port}/health`);
    console.log(`   SSE:    http://localhost:${port}/sse`);
    console.log(`   MongoDB: Connected`);
    console.log(`   MinIO:   Connected`);
  });

} else {
  // stdio transport — default
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
  console.error('🧵 Scale-Nexus MCP Server (stdio) connected');
}
