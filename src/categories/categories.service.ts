import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriyCreateDto } from './dto/create-category.dto';
import { Category } from './entities/categories.entity';

@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private categoriesRepository: Repository<Category>;

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findCategory(category_id: string): Promise<Category | null> {
    try {
      return await this.categoriesRepository.findOneBy({ id: category_id });
    } catch {
      return null;
    }
  }

  createCategory(newCategory: CategoriyCreateDto): Promise<Category> {
    return this.categoriesRepository.save(newCategory);
  }

  async deleteCategory(categoryId: string): Promise<Category | null> {
    try {
      const category = await this.categoriesRepository.findOneOrFail({
        where: { id: categoryId },
      });

      return await this.categoriesRepository.remove(category);
    } catch {
      return null;
    }
  }

  async updateCategory(
    categoryId: string,
    newCategory: CategoriyCreateDto,
  ): Promise<Category | null> {
    try {
      const toUpdate = await this.categoriesRepository.findOneOrFail({
        where: { id: categoryId },
      });

      const updated = Object.assign(toUpdate, newCategory);
      return this.categoriesRepository.save(updated);
    } catch {
      return null;
    }
  }
}
