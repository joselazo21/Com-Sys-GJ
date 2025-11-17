import { Injectable } from '@nestjs/common';
import { ProductCreateDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findProduct(product_id: string): Promise<Product | null> {
    try {
      return await this.productsRepository.findOneBy({ id: product_id });
    } catch {
      return null;
    }
  }

  createProduct(newProduct: ProductCreateDto): Promise<Product> {
    return this.productsRepository.save(newProduct);
  }

  async deleteBook(bookId: string): Promise<Product | null> {
    try {
      const product = await this.productsRepository.findOneOrFail({
        where: { id: bookId },
      });

      return await this.productsRepository.remove(product);
    } catch {
      return null;
    }
  }

  async updateProduct(
    productId: string,
    newProduct: ProductCreateDto,
  ): Promise<Product | null> {
    try {
      const toUpdate = await this.productsRepository.findOneOrFail({
        where: { id: productId },
      });

      const updated = Object.assign(toUpdate, newProduct);
      return this.productsRepository.save(updated);
    } catch {
      return null;
    }
  }
}
