import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';


@Injectable()
export class AppService {

  constructor(
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async upload(file) {
    const { originalname } = file;
    const bucketS3 = this.configService.get('AWS_BUCKET_NAME');
    await this.uploadS3(file.buffer, bucketS3, originalname);
}

  async uploadS3(file, bucket, name) {
      const s3 = this.getS3();
      const params = {
          Bucket: bucket,
          Key: String(name),
          Body: file,
      };
      return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
          if (err) {
              Logger.error(err);
              reject(err.message);
          }
          resolve(data);
          });
      });
  } 

  getS3() {
      return new S3({
          accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      });
  }
}
