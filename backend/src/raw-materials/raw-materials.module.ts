// Decorator de modulo do NestJS.
import { Module } from "@nestjs/common";
// Integra repositorios do TypeORM ao modulo.
import { TypeOrmModule } from "@nestjs/typeorm";
// Entidade de materia-prima.
import { RawMaterial } from "../entities/raw-material.entity";
// Controller com endpoints REST.
import { RawMaterialsController } from "./raw-materials.controller";
// Service com regras de negocio.
import { RawMaterialsService } from "./raw-materials.service";

// Modulo que agrupa rotas e servicos de materias-primas.
@Module({
  imports: [TypeOrmModule.forFeature([RawMaterial])],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService]
})
export class RawMaterialsModule {}
