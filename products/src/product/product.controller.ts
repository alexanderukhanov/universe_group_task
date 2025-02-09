import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Product } from '../database/entities/product.entity';
import { PaginationDto } from './dto/get-product.dto';
import { ProductPresenter } from './presenters/product.presenter';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({ type: Product })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get products' })
  @ApiOkResponse({ type: ProductPresenter })
  @Get()
  findAll(@Query() params: PaginationDto) {
    return this.productService.findAllWithPagination(params);
  }

  @ApiOperation({ summary: 'Get one product' })
  @ApiOkResponse({ type: Product })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ description: 'Product deleted' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(+id);
  }
}
