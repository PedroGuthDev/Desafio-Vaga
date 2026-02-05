// Decorators HTTP do NestJS e pipe para validar IDs.
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
// Entidade retornada pela API.
import { RawMaterial } from "../entities/raw-material.entity";
// DTO de entrada e service com a logica.
import { RawMaterialInput, RawMaterialsService } from "./raw-materials.service";

// Controller responsavel pelas rotas /raw-materials.
@Controller("raw-materials")
export class RawMaterialsController {
  constructor(private readonly service: RawMaterialsService) {}

  // GET /raw-materials - lista todas.
  @Get()
  list(): Promise<RawMaterial[]> {
    return this.service.list();
  }

  // GET /raw-materials/:id - busca por ID.
  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number): Promise<RawMaterial> {
    return this.service.get(id);
  }

  // POST /raw-materials - cria nova materia-prima.
  @Post()
  create(@Body() input: RawMaterialInput): Promise<RawMaterial> {
    return this.service.create(input);
  }

  // PUT /raw-materials/:id - atualiza materia-prima existente.
  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: RawMaterialInput
  ): Promise<RawMaterial> {
    return this.service.update(id, input);
  }

  // DELETE /raw-materials/:id - remove materia-prima.
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
