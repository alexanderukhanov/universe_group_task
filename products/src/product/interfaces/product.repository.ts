import { Product } from '../../database/entities/product.entity';
import { PaginationDto } from '../dto/get-product.dto';
import { ProductPresenter } from '../presenters/product.presenter';

export interface IProductRepository {
  create(data: Partial<Product>): Promise<Product>;
  findAllWithPagination(params: PaginationDto): Promise<ProductPresenter>;
  findOne(id: number): Promise<Product>;
  findOneByName(name: string): Promise<Product>;
  delete(id: number): Promise<void>;
}
