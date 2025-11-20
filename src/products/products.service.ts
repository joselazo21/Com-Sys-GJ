import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ProductCreateDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { In } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Product)
    private categoriesRepository: Repository<Category>,
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

  async findCategoriesbyName(names: string[]): Promise<Category[]> {
    let result: Category[] = [];

    result = await this.categoriesRepository.find({
      where: {
        name: In(names),
      },
    });

    return result;
  }

  async validateCategories(names: string[]): Promise<[boolean, Category[]]> {
    if (!names || names.length === 0) {
      return [false, []];
    }

    const categories = await this.findCategoriesbyName(names);
    const allFound = categories.length === names.length;

    return [allFound, categories];
  }

  async createProduct(newProduct: ProductCreateDto): Promise<Product> {
    const [allFound, categories] = await this.validateCategories(
      newProduct.categories,
    );
    if (!allFound) {
      throw new NotFoundException(
        'No se encontraron todas las categorias que proporciono',
      );
    }
    const product = this.productsRepository.create({
      ...newProduct,
      categories,
    });

    await this.productsRepository.save(product);

    return product;
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
    inputProduct: ProductCreateDto,
  ): Promise<Product | null> {
    const [allFound, categories] = await this.validateCategories(
      inputProduct.categories,
    );

    if (!allFound) {
      throw new NotFoundException(
        'No se encontraron todas las categorias proporcionadas',
      );
    }

    const newProduct = {
      ...inputProduct,
      categories,
    };

    const product = await this.productsRepository.preload({
      ...inputProduct,
      categories,
    });

    if (product) {
      return this.productsRepository.save(newProduct);
    }
    throw new NotFoundException(
      `No he encontrado el producto con id ${productId}`,
    );
  }
}
