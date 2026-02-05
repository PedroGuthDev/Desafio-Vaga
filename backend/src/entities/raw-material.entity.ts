// Decorators do TypeORM para mapear a entidade no banco.
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
// Transformer para tratar numericos vindos do Oracle.
import { numericTransformer } from "../common/transformers";

// Entidade que representa uma materia-prima.
@Entity("raw_materials")
@Unique(["code"])
export class RawMaterial {
  // Identificador unico auto-gerado.
  @PrimaryGeneratedColumn()
  id!: number;

  // Codigo unico da materia-prima.
  @Column({ nullable: false })
  code!: string;

  // Nome descritivo da materia-prima.
  @Column({ nullable: false })
  name!: string;

  // Quantidade em estoque (ate 3 casas decimais).
  @Column("number", { precision: 15, scale: 3, transformer: numericTransformer })
  stockQuantity!: number;
}
