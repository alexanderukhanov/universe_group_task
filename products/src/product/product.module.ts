import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { PRODUCT_REPOSITORY } from './constants/providers';
import { ProductRepository } from './product.repository';
import { SqsModule } from '../sqs/sqs.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SqsModule],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    ProductService,
    makeCounterProvider({
      name: 'created_products',
      help: 'Total number of created products',
    }),
    makeCounterProvider({
      name: 'deleted_products',
      help: 'Total number of deleted products',
    }),
  ],
})
export class ProductModule {}
