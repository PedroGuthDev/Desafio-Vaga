// Decorators e erros do NestJS.
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
// Permite injetar repositorio do TypeORM.
import { InjectRepository } from "@nestjs/typeorm";
// Tipo generico de repositorio.
import { Repository } from "typeorm";
// Entidade de produto.
import { Product } from "../entities/product.entity";

// DTO de entrada para criar/atualizar produtos.
export interface ProductInput {
  code: string;
  name: string;
  price: number;
}

// Service com operacoes CRUD de produtos.
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>
  ) {}

  // Lista todos os produtos.
  list(): Promise<Product[]> {
    return this.repository.find();
  }

  // Busca um produto por ID, lançando 404 se nao existir.
  async get(id: number): Promise<Product> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) throw new NotFoundException();
    return product;
  }

  // Cria um novo produto.
  async create(input: ProductInput): Promise<Product> {
    const existing = await this.repository.findOne({ where: { code: input.code } });
    if (existing) {
      throw new BadRequestException("Product code already exists.");
    }
    const product = this.repository.create(input);
    return this.repository.save(product);
  }

  // Atualiza um produto existente.
  async update(id: number, input: ProductInput): Promise<Product> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) throw new NotFoundException();
    const existing = await this.repository.findOne({ where: { code: input.code } });
    if (existing && existing.id !== id) {
      throw new BadRequestException("Product code already exists.");
    }
    product.code = input.code;
    product.name = input.name;
    product.price = input.price;
    return this.repository.save(product);
  }

  // Remove um produto pelo ID.
  async delete(id: number): Promise<void> {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) throw new NotFoundException();
    await this.repository.remove(product);
  }
}
