import { Injectable, OnModuleInit } from '@nestjs/common';
import { SQS } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { ConfigService } from '@nestjs/config';
import { ProductPresenter } from './presenters/product.presenter';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private readonly sqs: SQS;
  private consumer: Consumer;

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

  onModuleInit() {
    this.consumer = Consumer.create({
      queueUrl: this.configService.get('AWS_QUEUE_URL'),
      handleMessage: async (message) => {
        try {
          const messageBody: ProductPresenter = JSON.parse(message.Body);

          await this.processMessage(messageBody);
        } catch (error) {
          console.error('Error processing message:', error);
          throw error;
        }
      },
      sqs: this.sqs,
    });

    this.consumer.start();

    this.consumer.on('error', (err) => {
      console.error('Error:', err.message);
    });

    this.consumer.on('processing_error', (err) => {
      console.error('Processing error:', err.message);
    });
  }

  private async processMessage(message: ProductPresenter) {
    console.log('Received message:', message);
  }
}
