import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [ProductsModule],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
