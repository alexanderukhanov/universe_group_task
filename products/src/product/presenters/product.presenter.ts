import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../database/entities/product.entity';

export class ProductPresenter {
  @ApiProperty({ type: Product, isArray: true })
  rows: Product[];

  @ApiProperty({ example: 10 })
  count: number;
}
