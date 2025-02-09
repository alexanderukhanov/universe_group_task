import { SQS } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../database/entities/product.entity';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsService {
  private sqs: SQS;
  private readonly logger = new Logger(SqsService.name);

  constructor(private readonly configService: ConfigService) {
    this.sqs = new SQS({
      region: this.configService.get('AWS_REGION'),
      endpoint: this.configService.get('AWS_QUEUE_URL'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async sendMessage(message: { operation: string; data: Product }) {
    try {
      await this.sqs.sendMessage({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify(message),
      });

      this.logger.log('Message sent to queue');
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
}
