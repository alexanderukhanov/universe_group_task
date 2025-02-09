import { Module } from '@nestjs/common';
import { ConsumerService } from './sqs.consumer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ConsumerService],
})
export class SqsModule {}
