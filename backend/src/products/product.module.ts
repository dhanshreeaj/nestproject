import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
