// Interface do TypeORM para converter valores entre banco e aplicacao.
import { ValueTransformer } from "typeorm";

// Transformer para campos numericos do Oracle (geralmente retornados como string).
export const numericTransformer: ValueTransformer = {
  // Ao salvar no banco, envia o numero (ou null).
  to: (value: number | null | undefined) => value ?? null,
  // Ao ler do banco, converte string/number para number JS.
  from: (value: string | number | null) => {
    if (value === null || value === undefined) return null;
    return Number(value);
  }
};
