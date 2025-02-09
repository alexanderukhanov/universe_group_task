import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base-entity';

@Entity('product')
export class Product extends BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'name' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @ApiProperty({ example: 2.55 })
  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: false })
  cost: number;
}
