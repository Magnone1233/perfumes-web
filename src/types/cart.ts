import type { Fragrance } from "./fragrance";

export interface CartItem {
  fragrance: Fragrance;
  quantity: number;
  unitPrice: number;
}
