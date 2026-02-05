// Item individual do plano de producao.
export interface ProductionPlanItem {
  productId: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  units: number;
  totalValue: number;
}

// Resposta completa do plano de producao.
export interface ProductionPlanResponse {
  items: ProductionPlanItem[];
  totalValue: number;
}
