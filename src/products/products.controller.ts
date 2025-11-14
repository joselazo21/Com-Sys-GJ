import { Controller, Get } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductResponse } from './dto/response-product.dto';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Controller('products')
export class ProductsController {
  constructor(private ProductService: ProductService) {}

  @Get()
  findAll(): ProductResponse[] {
    return this.ProductService.findAll();
  }
}
