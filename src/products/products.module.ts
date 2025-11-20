import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductService],
  controllers: [ProductsController],
})
export class ProductsModule {}
