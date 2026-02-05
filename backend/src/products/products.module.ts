// Decorator de modulo do NestJS.
import { Module } from "@nestjs/common";
// Importa repositorios do TypeORM no escopo do modulo.
import { TypeOrmModule } from "@nestjs/typeorm";
// Entidade do dominio.
import { Product } from "../entities/product.entity";
// Controller com rotas REST de produtos.
import { ProductsController } from "./products.controller";
// Service com regras de negocio de produtos.
import { ProductsService } from "./products.service";

// Modulo que agrupa controller e service de produtos.
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
