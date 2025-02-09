import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [ConfigModule.forRoot(), SqsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
