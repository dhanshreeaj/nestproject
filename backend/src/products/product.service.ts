import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDto } from 'src/dto/craeteproduct.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  // create(data: CreateProductDto) {
  //   return this.prisma.product.create({ data });
  // }
  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data,
    });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  //delete product
  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.prisma.product.delete({ where: { id } });
  }

  //update product
  async updateProduct(id: number, data: Partial<Product>) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { id }, data });
  }
}
