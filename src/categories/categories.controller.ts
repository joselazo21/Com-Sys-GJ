import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriyCreateDto } from './dto/create-category.dto';
import { Category } from './entities/categories.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryID')
  findCategory(
    @Param('categoryID') categoryID: string,
  ): Promise<Category | null> {
    return this.categoriesService.findCategory(categoryID);
  }

  @Post()
  createCategory(@Body() newCategory: CategoriyCreateDto) {
    return this.categoriesService.createCategory(newCategory);
  }

  @Delete(':categoryId')
  deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Category | null> {
    return this.categoriesService.deleteCategory(categoryId);
  }

  @Put(':categoryId')
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() newCategory: CategoriyCreateDto,
  ): Promise<Category | null> {
    return this.categoriesService.updateCategory(categoryId, newCategory);
  }
}
