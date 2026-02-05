// Decorators HTTP do NestJS.
import { Controller, Get } from "@nestjs/common";
// Tipos de resposta do plano.
import { ProductionPlanResponse } from "./dto/production-plan.dto";
// Service com a logica de calculo.
import { ProductionPlanService } from "./production-plan.service";

// Controller responsavel pela rota /production-plan.
@Controller("production-plan")
export class ProductionPlanController {
  constructor(private readonly service: ProductionPlanService) {}

  // GET /production-plan - retorna o plano de producao calculado.
  @Get()
  getPlan(): Promise<ProductionPlanResponse> {
    return this.service.buildPlan();
  }
}
