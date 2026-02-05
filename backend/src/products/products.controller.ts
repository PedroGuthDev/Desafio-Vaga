// Decorators HTTP do NestJS e pipe de validacao de parametros.
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
// Entidade retornada nas respostas.
import { Product } from "../entities/product.entity";
// DTO de entrada e service com a logica.
import { ProductInput, ProductsService } from "./products.service";

// Controller responsavel pelas rotas /products.
@Controller("products")
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // GET /products - lista todos.
  @Get()
  list(): Promise<Product[]> {
    return this.service.list();
  }

  // GET /products/:id - busca por ID.
  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number): Promise<Product> {
    return this.service.get(id);
  }

  // POST /products - cria novo produto.
  @Post()
  create(@Body() input: ProductInput): Promise<Product> {
    return this.service.create(input);
  }

  // PUT /products/:id - atualiza produto existente.
  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: ProductInput
  ): Promise<Product> {
    return this.service.update(id, input);
  }

  // DELETE /products/:id - remove produto.
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
