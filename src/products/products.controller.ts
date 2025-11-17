import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductCreateDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':productID')
  findProduct(@Param('productID') productID: string): Promise<Product | null> {
    return this.productService.findProduct(productID);
  }

  @Post()
  createBook(@Body() newBook: ProductCreateDto): Promise<Product> {
    return this.productService.createProduct(newBook);
  }

  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: string): Promise<Product | null> {
    return this.productService.deleteBook(bookId);
  }

  @Put(':bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() newBook: ProductCreateDto,
  ): Promise<Product | null> {
    return this.productService.updateProduct(bookId, newBook);
  }
}
