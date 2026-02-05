// Decorators do TypeORM para mapear entidade e relacionamentos.
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
// Transformer para conversao de valores numericos.
import { numericTransformer } from "../common/transformers";
import { Product } from "./product.entity";
import { RawMaterial } from "./raw-material.entity";

// Entidade de associacao entre produto e materia-prima, com quantidade requerida.
@Entity("product_materials")
@Unique(["product", "rawMaterial"])
export class ProductMaterial {
  // Identificador unico auto-gerado.
  @PrimaryGeneratedColumn()
  id!: number;

  // Produto relacionado (muitos materiais podem apontar para um produto).
  @ManyToOne(() => Product, (product) => product.materials, { eager: true, nullable: false })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  // Materia-prima relacionada (muitos produtos podem usar o mesmo material).
  @ManyToOne(() => RawMaterial, { eager: true, nullable: false })
  @JoinColumn({ name: "raw_material_id" })
  rawMaterial!: RawMaterial;

  // Quantidade de materia-prima requerida para 1 unidade de produto.
  @Column("number", { precision: 15, scale: 3, transformer: numericTransformer })
  quantityRequired!: number;
}
