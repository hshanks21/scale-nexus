/**
 * MongoDB Atlas connection and database utilities
 */

import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  client = new MongoClient(uri);
  await client.connect();
  
  db = client.db('scale-nexus');
  
  // Create text indexes for search functionality
  await createIndexes();
  
  console.log('📊 Connected to MongoDB Atlas');
  return db;
}

async function createIndexes(): Promise<void> {
  if (!db) return;
  
  try {
    // Create text index on documents collection for searching
    await db.collection('documents').createIndex({
      name: 'text',
      business_type: 'text',
      'metadata.value': 'text'
    });
    
    // Create compound indexes for common queries
    await db.collection('documents').createIndex({ client_id: 1, is_latest: 1 });
    await db.collection('documents').createIndex({ created_at: -1 });
    await db.collection('documents').createIndex({ archived: 1, is_latest: 1 });
    
    console.log('📋 Database indexes created');
  } catch (error) {
    console.error('Failed to create indexes:', error);
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('📊 MongoDB connection closed');
  }
}
