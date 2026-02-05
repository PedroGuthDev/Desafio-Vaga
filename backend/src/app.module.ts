// Decorator que transforma a classe em um modulo do NestJS.
import { Module } from "@nestjs/common";
// Integracao do TypeORM com NestJS.
import { TypeOrmModule } from "@nestjs/typeorm";
// Entidades do dominio que serao mapeadas para tabelas no banco.
import { Product } from "./entities/product.entity";
import { RawMaterial } from "./entities/raw-material.entity";
import { ProductMaterial } from "./entities/product-material.entity";
// Modulos de funcionalidades (controllers + services).
import { ProductsModule } from "./products/products.module";
import { RawMaterialsModule } from "./raw-materials/raw-materials.module";
import { ProductMaterialsModule } from "./product-materials/product-materials.module";
import { ProductionPlanModule } from "./production-plan/production-plan.module";

function buildConnectString(): string {
  // Prioriza uma string de conexao unica, se informada.
  if (process.env.ORACLE_CONNECT_STRING) return process.env.ORACLE_CONNECT_STRING;
  // Monta a string no formato host:port/service a partir das variaveis.
  const host = process.env.DB_HOST ?? "localhost";
  const port = process.env.DB_PORT ?? "1521";
  const service = process.env.DB_SERVICE ?? "XEPDB1";
  return `${host}:${port}/${service}`;
}

@Module({
  imports: [
    // Configuracao global do TypeORM.
    TypeOrmModule.forRoot({
      type: "oracle",
      username: process.env.DB_USERNAME ?? "system",
      password: process.env.DB_PASSWORD ?? "oracle",
      connectString: buildConnectString(),
      // Sincroniza o schema automaticamente (ideal para desenvolvimento).
      synchronize: true,
      // Log de SQL para facilitar debug.
      logging: true,
      entities: [Product, RawMaterial, ProductMaterial]
    }),
    // Modulos de dominio.
    ProductsModule,
    RawMaterialsModule,
    ProductMaterialsModule,
    ProductionPlanModule
  ]
})
export class AppModule {}
