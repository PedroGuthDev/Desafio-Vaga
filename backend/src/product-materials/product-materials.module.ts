// Decorator de modulo do NestJS.
import { Module } from "@nestjs/common";
// Permite disponibilizar repositorios do TypeORM.
import { TypeOrmModule } from "@nestjs/typeorm";
// Entidades utilizadas no relacionamento produto <-> materia-prima.
import { ProductMaterial } from "../entities/product-material.entity";
import { Product } from "../entities/product.entity";
import { RawMaterial } from "../entities/raw-material.entity";
// Controller com endpoints REST.
import { ProductMaterialsController } from "./product-materials.controller";
// Service com regras de negocio do relacionamento.
import { ProductMaterialsService } from "./product-materials.service";

// Modulo que agrupa controller e service de materiais por produto.
@Module({
  imports: [TypeOrmModule.forFeature([ProductMaterial, Product, RawMaterial])],
  controllers: [ProductMaterialsController],
  providers: [ProductMaterialsService]
})
export class ProductMaterialsModule {}
