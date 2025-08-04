import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'src/dto/craeteproduct.dto';
import { Product } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productSerive: ProductService) {}
  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productSerive.create(data);
  }

  @Get()
  findAll() {
    return this.productSerive.findAll();
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productSerive.deleteProduct(+id);
  }
  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateDate: any = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
    };
    if (file) {
      updateDate.imageUrl = `/uploads/${file.filename}`;
    }
    return this.productSerive.updateProduct(+id, updateDate);
  }
  // updateProduct(@Param('id') id: string, @Body() data: Partial<Product>) {
  //   return this.productSerive.updateProduct(+id, data);
  // }
}
