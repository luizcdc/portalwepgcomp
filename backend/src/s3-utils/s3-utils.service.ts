import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3UtilsService {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.S3_AWS_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_AWS_REGION,
      credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async createBucket(bucket: string = this.bucketName): Promise<boolean> {
    try {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: bucket,
        }),
      );
      console.log(`Bucket ${bucket} created successfully`);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async bucketExists(bucket: string = this.bucketName): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({
          Bucket: bucket,
        }),
      );
      return true;
    } catch (err) {
      if (err.name === 'NotFound' || err.$metada?.httpStatusCode === 404) {
        return false;
      }
      throw err;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    key: string,
    bucket: string = this.bucketName,
  ): Promise<boolean> {
    if (!(await this.bucketExists(bucket))) {
      await this.createBucket(bucket);
    }
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async listFiles(bucket: string = this.bucketName): Promise<string[]> {
    // Create the bucket if it doesn't exist
    if (!(await this.bucketExists(bucket))) {
      await this.createBucket(bucket);
    }
    try {
      const response = await this.s3Client.send(
        new ListObjectsCommand({
          Bucket: bucket,
        }),
      );
      const contentsList = response.Contents.map((obj) => obj.Key).join('\n');
      console.log("\nHere's a list of files in the bucket:");
      console.log(`${contentsList}\n`);
      return response.Contents.map((obj) => obj.Key);
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to list files: ${err.message}`);
    }
  }
}
