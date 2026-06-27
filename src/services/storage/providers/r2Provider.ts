import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageProvider, UploadFile, UploadOptions, UploadResult, DeleteResult } from './interface';

export enum StorageProviderType {
  R2 = 'r2',
  S3 = 's3',
  LOCAL = 'local',
}

export class R2StorageProvider implements StorageProvider {
  readonly id = StorageProviderType.R2;

  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    this.bucket = process.env.R2_BUCKET_NAME || '';
    this.publicUrl = process.env.R2_PUBLIC_URL || '';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2 credentials not configured');
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(file: UploadFile, options?: UploadOptions): Promise<UploadResult> {
    const key = this.generateKey(file.filename, options?.folder);
    
    try {
      await this.client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimeType,
        CacheControl: options?.cacheControl || 'public, max-age=31536000, immutable',
        ...(options?.metadata && { Metadata: options.metadata }),
      }));

      return {
        success: true,
        path: key,
        url: `${this.publicUrl}/${key}`,
        size: file.size,
        mimeType: file.mimeType,
      };
    } catch (error) {
      console.error('R2 upload error:', error);
      return {
        success: false,
        path: key,
        url: '',
        size: 0,
        mimeType: file.mimeType,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async uploadMultiple(files: UploadFile[], options?: UploadOptions): Promise<UploadResult[]> {
    return Promise.all(files.map(file => this.upload(file, options)));
  }

  async delete(path: string): Promise<DeleteResult> {
    try {
      await this.client.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      }));

      return { success: true, path };
    } catch (error) {
      console.error('R2 delete error:', error);
      return {
        success: false,
        path,
        error: error instanceof Error ? error.message : 'Delete failed',
      };
    }
  }

  async deleteMultiple(paths: string[]): Promise<DeleteResult[]> {
    return Promise.all(paths.map(path => this.delete(path)));
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  async getPublicUrl(path: string): Promise<string> {
    return `${this.publicUrl}/${path}`;
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({
        Bucket: this.bucket,
        Key: path,
      }));
      return true;
    } catch {
      return false;
    }
  }

  async copy(from: string, to: string): Promise<void> {
    // R2 doesn't have native copy, so we download and re-upload
    // This is a simplified implementation
    const response = await this.client.send(new GetObjectCommand({
      Bucket: this.bucket,
      Key: from,
    }));

    if (!response.Body) {
      throw new Error('Failed to get object body');
    }

    const chunks: Uint8Array[] = [];
    const body = response.Body as any;
    
    for await (const chunk of body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: to,
      Body: buffer,
      ContentType: response.ContentType,
    }));
  }

  async move(from: string, to: string): Promise<void> {
    await this.copy(from, to);
    await this.delete(from);
  }

  private generateKey(filename: string, folder?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return folder 
      ? `${folder}/${timestamp}-${random}-${sanitized}`
      : `${timestamp}-${random}-${sanitized}`;
  }
}

// Factory function
let r2Provider: R2StorageProvider | null = null;

export function getR2Provider(): R2StorageProvider {
  if (!r2Provider) {
    r2Provider = new R2StorageProvider();
  }
  return r2Provider;
}