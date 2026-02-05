// Decorator de modulo do NestJS.
import { Module } from "@nestjs/common";
// Disponibiliza repositorios do TypeORM.
import { TypeOrmModule } from "@nestjs/typeorm";
// Entidades usadas no calculo do plano.
import { Product } from "../entities/product.entity";
import { RawMaterial } from "../entities/raw-material.entity";
import { ProductMaterial } from "../entities/product-material.entity";
// Controller com endpoint do plano.
import { ProductionPlanController } from "./production-plan.controller";
// Service com a regra de calculo.
import { ProductionPlanService } from "./production-plan.service";

// Modulo que expõe o endpoint de plano de producao.
@Module({
  imports: [TypeOrmModule.forFeature([Product, RawMaterial, ProductMaterial])],
  controllers: [ProductionPlanController],
  providers: [ProductionPlanService]
})
export class ProductionPlanModule {}
