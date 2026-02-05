// Decorators e erros do NestJS.
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
// Injetor de repositorios do TypeORM.
import { InjectRepository } from "@nestjs/typeorm";
// Tipo generico de repositorio.
import { Repository } from "typeorm";
// Entidades do relacionamento.
import { ProductMaterial } from "../entities/product-material.entity";
import { Product } from "../entities/product.entity";
import { RawMaterial } from "../entities/raw-material.entity";

// Service que gerencia a associacao entre produto e materia-prima.
@Injectable()
export class ProductMaterialsService {
  constructor(
    @InjectRepository(ProductMaterial)
    private readonly repository: Repository<ProductMaterial>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(RawMaterial)
    private readonly materials: Repository<RawMaterial>
  ) {}

  // Lista todos os relacionamentos produto-materia.
  list(): Promise<ProductMaterial[]> {
    return this.repository.find();
  }

  // Busca um relacionamento por ID.
  async get(id: number): Promise<ProductMaterial> {
    const pm = await this.repository.findOne({ where: { id } });
    if (!pm) throw new NotFoundException();
    return pm;
  }

  // Cria um relacionamento entre produto e materia-prima.
  async create(
    productId: number,
    rawMaterialId: number,
    quantityRequired: number
  ): Promise<ProductMaterial> {
    // Carrega o produto pelo ID.
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException();

    // Carrega a materia-prima pelo ID.
    const material = await this.materials.findOne({ where: { id: rawMaterialId } });
    if (!material) throw new NotFoundException();

    // Verifica se a associacao ja existe para evitar duplicidade.
    const existing = await this.repository.findOne({
      where: {
        product: { id: productId },
        rawMaterial: { id: rawMaterialId }
      }
    });
    if (existing) {
      throw new BadRequestException("Association already exists for this product and raw material.");
    }

    // Cria a entidade com os dados recebidos.
    const pm = this.repository.create({
      product,
      rawMaterial: material,
      quantityRequired
    });

    // Persiste no banco.
    return this.repository.save(pm);
  }

  // Atualiza um relacionamento existente.
  async update(
    id: number,
    productId: number,
    rawMaterialId: number,
    quantityRequired: number
  ): Promise<ProductMaterial> {
    const pm = await this.repository.findOne({ where: { id } });
    if (!pm) throw new NotFoundException();

    // Recarrega as entidades relacionadas para garantir integridade.
    const product = await this.products.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException();

    const material = await this.materials.findOne({ where: { id: rawMaterialId } });
    if (!material) throw new NotFoundException();

    // Evita duplicidade quando alterando para uma combinacao ja existente.
    const existing = await this.repository.findOne({
      where: {
        product: { id: productId },
        rawMaterial: { id: rawMaterialId }
      }
    });
    if (existing && existing.id !== id) {
      throw new BadRequestException("Association already exists for this product and raw material.");
    }

    // Atualiza os campos do relacionamento.
    pm.product = product;
    pm.rawMaterial = material;
    pm.quantityRequired = quantityRequired;

    // Salva as alteracoes.
    return this.repository.save(pm);
  }

  // Remove um relacionamento por ID.
  async delete(id: number): Promise<void> {
    const pm = await this.repository.findOne({ where: { id } });
    if (!pm) throw new NotFoundException();
    await this.repository.remove(pm);
  }
}
