import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { SqsService } from '../sqs/sqs.service';
import { PRODUCT_REPOSITORY } from './constants/providers';
import { PaginationDto } from './dto/get-product.dto';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

const mockProductRepository = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findOneByName: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockSqsService = {
  sendMessage: jest.fn(),
};

const mockCreatedCounter = {
  inc: jest.fn(),
};

const mockDeletedCounter = {
  inc: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
        {
          provide: SqsService,
          useValue: mockSqsService,
        },
        {
          provide: 'PROM_METRIC_CREATED_PRODUCTS',
          useValue: mockCreatedCounter,
        },
        {
          provide: 'PROM_METRIC_DELETED_PRODUCTS',
          useValue: mockDeletedCounter,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should create a product successfully', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      cost: 22.55,
    };
    const createdProduct: Product = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...createProductDto,
    };

    mockProductRepository.findOneByName.mockResolvedValue(null);
    mockProductRepository.create.mockResolvedValue(createdProduct);

    const result = await service.create(createProductDto);

    expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
      createProductDto.name,
    );
    expect(mockProductRepository.create).toHaveBeenCalledWith(createProductDto);
    expect(mockSqsService.sendMessage).toHaveBeenCalledWith({
      operation: 'create',
      data: createdProduct,
    });
    expect(mockCreatedCounter.inc).toHaveBeenCalled();
    expect(result).toEqual(createdProduct);
  });

  it('should throw an error if product already exists', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      cost: 22.55,
    };
    mockProductRepository.findOneByName.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...createProductDto,
    });

    await expect(service.create(createProductDto)).rejects.toThrow(
      'Product with this name is already exists',
    );
    expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
      createProductDto.name,
    );
    expect(mockProductRepository.create).not.toHaveBeenCalled();
    expect(mockSqsService.sendMessage).not.toHaveBeenCalled();
    expect(mockCreatedCounter.inc).not.toHaveBeenCalled();
  });

  it('should delete product successfully', async () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      cost: 22.55,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProductRepository.findOne.mockResolvedValue(product);

    await service.delete(product.id);

    expect(mockProductRepository.findOne).toHaveBeenCalledWith(product.id);
    expect(mockProductRepository.delete).toHaveBeenCalledWith(product.id);
    expect(mockDeletedCounter.inc).toHaveBeenCalled();
  });

  it('should throw an error if product is not exists', async () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      cost: 22.55,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockProductRepository.findOne.mockResolvedValue(undefined);

    await expect(service.delete(product.id)).rejects.toThrow(
      `Product with id ${product.id} not found`,
    );

    expect(mockProductRepository.findOne).toHaveBeenCalledWith(product.id);
    expect(mockProductRepository.delete).not.toHaveBeenCalledWith(product.id);
    expect(mockDeletedCounter.inc).not.toHaveBeenCalled();
  });

  it('should return products with pagination', async () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      cost: 22.55,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const response = {
      count: 5,
      rows: Array.from({ length: 5 }, (_, i) => ({
        ...product,
        id: ++i,
        name: product.name + ' ' + i,
      })),
    };
    const params: PaginationDto = { page: 1, limit: 5 };

    mockProductRepository.findAllWithPagination.mockResolvedValue(response);
    const result = await service.findAllWithPagination(params);

    expect(mockProductRepository.findAllWithPagination).toHaveBeenCalledWith(
      params,
    );
    expect(result).toEqual(response);
  });
});
