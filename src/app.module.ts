import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SalesModule } from './sales/sales.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const commonConfig = {
          type: process.env.DB_TYPE as any,
          database: process.env.DB_DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV !== 'production',
        };
        if (process.env.DB_TYPE !== 'sqlite') {
          return {
            ...commonConfig,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
          };
        }
        return commonConfig;
      },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SalesModule,
  ],
})
export class AppModule { }
