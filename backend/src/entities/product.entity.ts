// Decorators e tipos do TypeORM para mapear a entidade no banco.
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
// Entidade de relacionamento entre produto e materia-prima.
import { ProductMaterial } from "./product-material.entity";
// Transformer para conversao segura de numericos do Oracle.
import { numericTransformer } from "../common/transformers";

// Entidade que representa um produto final.
@Entity("products")
@Unique(["code"])
export class Product {
  // Identificador unico auto-gerado.
  @PrimaryGeneratedColumn()
  id!: number;

  // Codigo unico do produto.
  @Column({ nullable: false })
  code!: string;

  // Nome descritivo do produto.
  @Column({ nullable: false })
  name!: string;

  // Preco unitario com 2 casas decimais.
  @Column("number", { precision: 15, scale: 2, transformer: numericTransformer })
  price!: number;

  // Relacao com os materiais necessarios para produzir o produto.
  @OneToMany(() => ProductMaterial, (pm) => pm.product, { cascade: true })
  materials?: ProductMaterial[];
}
