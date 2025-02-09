import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PRODUCT_REPOSITORY } from './constants/providers';
import { IProductRepository } from './interfaces/product.repository';
import { PaginationDto } from './dto/get-product.dto';
import { SqsService } from '../sqs/sqs.service';
import { Product } from '../database/entities/product.entity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly sqsService: SqsService,
    @InjectMetric('created_products') public createdCounter: Counter<string>,
    @InjectMetric('deleted_products') public deletedCounter: Counter<string>,
  ) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.findOneByName(
      createProductDto.name,
    );
    if (product) {
      throw new BadRequestException('Product with this name is already exists');
    }

    const createdProduct =
      await this.productRepository.create(createProductDto);
    await this.sqsService.sendMessage({
      operation: 'create',
      data: createdProduct,
    });
    this.createdCounter.inc();

    return createdProduct;
  }

  findAllWithPagination(params: PaginationDto) {
    return this.productRepository.findAllWithPagination(params);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async delete(id: number): Promise<void> {
    const product = await this.findOne(id);

    await this.productRepository.delete(id);
    await this.sqsService.sendMessage({
      operation: 'delete',
      data: product,
    });
    this.deletedCounter.inc();
  }
}
