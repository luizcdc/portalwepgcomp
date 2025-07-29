import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3UtilsService {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.S3_AWS_BUCKET_NAME;
  private readonly logger = new Logger(S3UtilsService.name);

  constructor(private readonly prismaClient: PrismaService) {
    this.s3Client = new S3Client({
      region: process.env.S3_AWS_REGION,
      endpoint: process.env.S3_AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  async createBucket(bucket: string = this.bucketName): Promise<boolean> {
    try {
      await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: bucket,
        }),
      );
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
      // Validation to check if the bucket is empty
      if (!response.Contents || response.Contents.length === 0) {
        console.log(`The bucket '${bucket}' is empty.`);
        return [];
      }
      const fileKeys = response.Contents.map(
        (obj) => obj.Key || 'Unnamed file',
      );
      return fileKeys;
    } catch (err) {
      console.error(`Error listing files in bucket ${bucket}:`, err);
      throw new Error(
        `Failed to list files in bucket "${bucket}": ${err.message}`,
      );
    }
  }

  async deleteFile(
    key: string,
    bucket: string = this.bucketName,
  ): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      console.log(`File ${key} removed from bucket ${bucket}`);
      return true;
    } catch (err) {
      console.error(
        `Error on removing file ${key} from bucket ${bucket}:`,
        err,
      );
      return false;
    }
  }

  async deleteUnlinkedPdfFiles(): Promise<string[]> {
    const linkedFiles = await this.prismaClient.submission.findMany({
      select: { pdfFile: true },
    });
    const linkedFileSet = new Set(linkedFiles.map((file) => file.pdfFile));

    const allFiles = await this.listFiles();

    const filesToDelete = allFiles.filter((file) => !linkedFileSet.has(file));

    for (const file of filesToDelete) {
      await this.deleteFile(file);
    }

    return filesToDelete; // Return the removed files
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Executes everyday at midnight
  async cleanupJob() {
    this.logger.warn('Starting cleanup of PDF files without submission...');
    const deletedFiles = await this.deleteUnlinkedPdfFiles();
    this.logger.warn(
      `Cleaning completed. Total files removed: ${deletedFiles.length}`,
    );
  }
}
