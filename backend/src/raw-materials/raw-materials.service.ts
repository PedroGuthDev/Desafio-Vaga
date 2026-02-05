// Decorators e erros do NestJS.
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
// Injetor de repositorios do TypeORM.
import { InjectRepository } from "@nestjs/typeorm";
// Tipo de repositorio generico.
import { Repository } from "typeorm";
// Entidade de materia-prima.
import { RawMaterial } from "../entities/raw-material.entity";

// DTO de entrada para criar/atualizar materias-primas.
export interface RawMaterialInput {
  code: string;
  name: string;
  stockQuantity: number;
}

// Service com operacoes CRUD de materias-primas.
@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectRepository(RawMaterial) private readonly repository: Repository<RawMaterial>
  ) {}

  // Lista todas as materias-primas.
  list(): Promise<RawMaterial[]> {
    return this.repository.find();
  }

  // Busca uma materia-prima por ID, com 404 se nao existir.
  async get(id: number): Promise<RawMaterial> {
    const material = await this.repository.findOne({ where: { id } });
    if (!material) throw new NotFoundException();
    return material;
  }

  // Cria uma nova materia-prima.
  async create(input: RawMaterialInput): Promise<RawMaterial> {
    const existing = await this.repository.findOne({ where: { code: input.code } });
    if (existing) {
      throw new BadRequestException("Raw material code already exists.");
    }
    const material = this.repository.create(input);
    return this.repository.save(material);
  }

  // Atualiza uma materia-prima existente.
  async update(id: number, input: RawMaterialInput): Promise<RawMaterial> {
    const material = await this.repository.findOne({ where: { id } });
    if (!material) throw new NotFoundException();
    const existing = await this.repository.findOne({ where: { code: input.code } });
    if (existing && existing.id !== id) {
      throw new BadRequestException("Raw material code already exists.");
    }
    material.code = input.code;
    material.name = input.name;
    material.stockQuantity = input.stockQuantity;
    return this.repository.save(material);
  }

  // Remove uma materia-prima pelo ID.
  async delete(id: number): Promise<void> {
    const material = await this.repository.findOne({ where: { id } });
    if (!material) throw new NotFoundException();
    await this.repository.remove(material);
  }
}
