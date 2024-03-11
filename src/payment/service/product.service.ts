import { Injectable } from '@nestjs/common';
import { Product } from '../entity/product.entity';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return await this.productRepository.getProductsByIds(productIds);
  }
}
