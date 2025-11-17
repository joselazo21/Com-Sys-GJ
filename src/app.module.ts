// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import * as path from 'path'; // ← IMPORTAR path
import * as fs from 'fs'; // ← IMPORTAR fs

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configPath = path.join(process.cwd(), 'ormconfig.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config;
      },
    }),
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
