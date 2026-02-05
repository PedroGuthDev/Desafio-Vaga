// Decorators HTTP e erros do NestJS.
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from "@nestjs/common";
// Entidade retornada nas respostas.
import { ProductMaterial } from "../entities/product-material.entity";
// Service com regras de negocio do relacionamento.
import { ProductMaterialsService } from "./product-materials.service";

// Converte string para numero com validacao, gerando erro 400 em caso invalido.
function parseNumber(value: string | undefined, name: string): number {
  if (value === undefined) throw new BadRequestException(`${name} is required`);
  const parsed = Number(value);
  if (Number.isNaN(parsed)) throw new BadRequestException(`${name} must be a number`);
  return parsed;
}

// Controller responsavel pelas rotas /product-materials.
@Controller("product-materials")
export class ProductMaterialsController {
  constructor(private readonly service: ProductMaterialsService) {}

  // GET /product-materials - lista todas as relacoes.
  @Get()
  list(): Promise<ProductMaterial[]> {
    return this.service.list();
  }

  // GET /product-materials/:id - busca por ID.
  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number): Promise<ProductMaterial> {
    return this.service.get(id);
  }

  // POST /product-materials - cria relacao via query params.
  @Post()
  create(
    @Query("productId", ParseIntPipe) productId: number,
    @Query("rawMaterialId", ParseIntPipe) rawMaterialId: number,
    @Query("quantityRequired") quantityRequired: string
  ): Promise<ProductMaterial> {
    return this.service.create(
      productId,
      rawMaterialId,
      parseNumber(quantityRequired, "quantityRequired")
    );
  }

  // PUT /product-materials/:id - atualiza relacao via query params.
  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Query("productId", ParseIntPipe) productId: number,
    @Query("rawMaterialId", ParseIntPipe) rawMaterialId: number,
    @Query("quantityRequired") quantityRequired: string
  ): Promise<ProductMaterial> {
    return this.service.update(
      id,
      productId,
      rawMaterialId,
      parseNumber(quantityRequired, "quantityRequired")
    );
  }

  // DELETE /product-materials/:id - remove relacao.
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
