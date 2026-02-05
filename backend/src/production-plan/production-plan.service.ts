// Decorator de service do NestJS.
import { Injectable } from "@nestjs/common";
// Injetor de repositorios do TypeORM.
import { InjectRepository } from "@nestjs/typeorm";
// Tipo generico de repositorio.
import { Repository } from "typeorm";
// Biblioteca para operacoes numericas precisas (evita erros de ponto flutuante).
import Decimal from "decimal.js";
// Entidades usadas no calculo do plano.
import { Product } from "../entities/product.entity";
import { RawMaterial } from "../entities/raw-material.entity";
import { ProductMaterial } from "../entities/product-material.entity";
// DTO de resposta do plano.
import { ProductionPlanResponse } from "./dto/production-plan.dto";

// Service que calcula o plano de producao com base em estoque e precos.
@Injectable()
export class ProductionPlanService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(RawMaterial)
    private readonly materials: Repository<RawMaterial>,
    @InjectRepository(ProductMaterial)
    private readonly productMaterials: Repository<ProductMaterial>
  ) {}

  // Calcula o plano de producao priorizando produtos mais caros.
  async buildPlan(): Promise<ProductionPlanResponse> {
    // Lista produtos ordenados por preco (desc).
    const products = await this.products.find({ order: { price: "DESC" } });
    // Carrega todas as materias-primas com estoque disponivel.
    const rawMaterials = await this.materials.find();

    // Mapa de estoque disponivel por materia-prima.
    const availableStock = new Map<number, Decimal>();
    for (const material of rawMaterials) {
      availableStock.set(material.id, new Decimal(material.stockQuantity ?? 0));
    }

    // Resposta inicial (sem itens).
    const response: ProductionPlanResponse = {
      items: [],
      totalValue: 0
    };

    // Para cada produto, tenta calcular quantas unidades podem ser produzidas.
    for (const product of products) {
      const materials = await this.productMaterials.find({
        where: { product: { id: product.id } }
      });

      // Se nao houver materias associadas, ignora o produto.
      if (materials.length === 0) continue;

      // Comeca com infinito e reduz conforme o gargalo de materiais.
      let maxUnits = Number.POSITIVE_INFINITY;

      for (const pm of materials) {
        // Quantidade necessaria do material para 1 unidade do produto.
        const required = new Decimal(pm.quantityRequired ?? 0);
        // Estoque disponivel para a materia-prima.
        const stock = availableStock.get(pm.rawMaterial.id) ?? new Decimal(0);

        // Se a quantidade requerida for zero/negativa, nao produz.
        if (required.lte(0)) {
          maxUnits = 0;
          break;
        }

        // Calcula o maximo de unidades pelo material atual.
        const possible = stock.div(required).floor().toNumber();
        if (possible < maxUnits) maxUnits = possible;
      }

      // Se nao for possivel produzir nenhuma unidade, pula.
      if (!Number.isFinite(maxUnits) || maxUnits <= 0) continue;

      // Deduz o consumo de materia-prima do estoque.
      for (const pm of materials) {
        const required = new Decimal(pm.quantityRequired ?? 0);
        const current = availableStock.get(pm.rawMaterial.id) ?? new Decimal(0);
        availableStock.set(pm.rawMaterial.id, current.minus(required.mul(maxUnits)));
      }

      // Calcula valor total deste item.
      const unitPrice = new Decimal(product.price ?? 0);
      const totalValue = unitPrice.mul(maxUnits);

      // Adiciona item no plano.
      response.items.push({
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        unitPrice: unitPrice.toNumber(),
        units: maxUnits,
        totalValue: totalValue.toNumber()
      });

      // Soma o valor total geral.
      response.totalValue = new Decimal(response.totalValue).plus(totalValue).toNumber();
    }

    // Retorna o plano consolidado.
    return response;
  }
}
