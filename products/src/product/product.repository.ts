import { Injectable } from '@nestjs/common';
import { IProductRepository } from './interfaces/product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/get-product.dto';
import { ProductPresenter } from './presenters/product.presenter';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const results = await this.repository.manager.query<Product[]>(
      `INSERT INTO product (name, cost) VALUES ($1, $2) RETURNING *`,
      [data.name, data.cost],
    );

    return results[0];
  }

  async findAllWithPagination(
    params: PaginationDto,
  ): Promise<ProductPresenter> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    return this.repository.manager.transaction(async (transaction) => {
      const rows = await transaction.query<Product[]>(
        `SELECT * FROM product LIMIT $1 OFFSET $2`,
        [limit, offset],
      );
      const count = await transaction
        .query(`SELECT COUNT(*)::int FROM product`)
        .then<number>((result) => result[0].count);

      return { count, rows };
    });
  }

  async findOne(id: number): Promise<Product> {
    const results = await this.repository.manager.query<Product>(
      `SELECT * FROM product WHERE id = $1`,
      [id],
    );

    return results[0];
  }

  async findOneByName(name: string): Promise<Product> {
    const results = await this.repository.manager.query<Product[]>(
      `SELECT * FROM product WHERE name = $1`,
      [name],
    );

    return results[0];
  }

  async delete(id: number): Promise<void> {
    await this.repository.query(`DELETE FROM product WHERE id = $1`, [id]);
  }
}
