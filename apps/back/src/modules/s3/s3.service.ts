import {
  CopyObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  public readonly client: S3Client;
  public readonly region: string;
  public readonly bucketName: string;

  constructor(private readonly config: ConfigService) {
    this.region = this.config.get<string>('s3.region')!;
    this.bucketName = this.config.get<string>('s3.bucketName')!;

    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.config.get<string>('s3.accessKey')!,
        secretAccessKey: this.config.get<string>('s3.secretAccessKey')!,
      },
    });
  }

  public async copyObject({
    fromBucket = this.bucketName,
    fromKey,
    toBucket = this.bucketName,
    toKey,
    removeAfterCopyNoGuarantee = false,
  }: {
    fromBucket?: string;
    fromKey: string;
    toBucket?: string;
    toKey: string;
    removeAfterCopyNoGuarantee?: boolean;
  }) {
    const fullFromKey = `${fromBucket}/${fromKey}`;

    const command = new CopyObjectCommand({
      Bucket: toBucket,
      Key: toKey,
      CopySource: fullFromKey,
    });
    try {
      const response = await this.client.send(command);

      if (
        response.$metadata.httpStatusCode === 200 &&
        removeAfterCopyNoGuarantee
      ) {
        this.deleteObject({ bucket: fromBucket, key: fromKey });
      }

      return response.$metadata.httpStatusCode === 200;
    } catch (error) {
      return false;
    }
  }

  public async deleteObject({
    bucket = this.bucketName,
    key,
  }: {
    bucket?: string;
    key: string;
  }) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return response.$metadata.httpStatusCode === 204;
    } catch (error) {
      return false;
    }
  }

  public getCloudfrontSignedUrl({
    key,
    expiresInSeconds = 60 * 15,
  }: {
    key: string;
    expiresInSeconds?: number;
  }) {
    const now = new Date();
    const expiresAsDate = new Date(Date.now() + expiresInSeconds * 1000);
    const url = `${this.config.getOrThrow<string>('cloudfront.url')}/${key}`;

    return getSignedUrl({
      url,
      dateGreaterThan: now.toISOString(),
      dateLessThan: expiresAsDate.toISOString(),
      keyPairId: this.config.getOrThrow<string>('cloudfront.keyPairId'),
      privateKey: this.config.getOrThrow<string>('cloudfront.privateKey'),
    });
  }
}
