import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @UpdateDateColumn()
  updatedAt: Date;
}
