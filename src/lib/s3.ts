/**
 * MinIO S3 client and utilities
 */

import { Client as MinioClient } from 'minio';

let s3Client: MinioClient | null = null;
const bucketName = process.env.MINIO_BUCKET || 'nova-vault';

export function getS3Client(): MinioClient {
  if (!s3Client) {
    const endpoint = process.env.MINIO_ENDPOINT;
    const port = parseInt(process.env.MINIO_PORT || '9000', 10);
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;

    if (!endpoint || !accessKey || !secretKey) {
      throw new Error('MinIO configuration missing. Check MINIO_* environment variables.');
    }

    s3Client = new MinioClient({
      endPoint: endpoint,
      port: port,
      useSSL: false,
      accessKey: accessKey,
      secretKey: secretKey,
    });

    console.log(`📦 MinIO client initialized - ${endpoint}:${port}`);
  }

  return s3Client;
}

export async function ensureBucket(): Promise<void> {
  const client = getS3Client();
  
  const bucketExists = await client.bucketExists(bucketName);
  if (!bucketExists) {
    await client.makeBucket(bucketName);
    console.log(`📦 Created bucket: ${bucketName}`);
  }
}

export async function uploadFile(
  objectName: string,
  buffer: Buffer,
  contentType: string = 'application/octet-stream'
): Promise<string> {
  const client = getS3Client();
  await ensureBucket();
  
  await client.putObject(bucketName, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  });
  
  return `s3://${bucketName}/${objectName}`;
}

export async function getPresignedUrl(
  objectName: string,
  ttlSeconds: number = 3600
): Promise<string> {
  const client = getS3Client();
  
  return await client.presignedGetObject(bucketName, objectName, ttlSeconds);
}

export { bucketName };
