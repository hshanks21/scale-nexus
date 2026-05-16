/**
 * API key authentication middleware
 */

import { IncomingMessage, ServerResponse } from 'http';

export function validateApiKey(req: IncomingMessage): boolean {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.NEXUS_API_KEY;
  
  if (!expectedKey) {
    console.warn('NEXUS_API_KEY not set - authentication disabled');
    return true; // Allow if no key configured
  }
  
  if (!apiKey || apiKey !== expectedKey) {
    return false;
  }
  
  return true;
}

export function sendAuthError(res: ServerResponse): void {
  res.writeHead(401, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Unauthorized. Valid X-Api-Key header required.' }));
}
