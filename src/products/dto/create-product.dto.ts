export class ProductCreateDto {
  code: string;
  name: string;
  description?: string;
  category: string;
  purchasePriceCup: number;
  purchasePriceUsd: number;
  salePriceCup: number;
  salePriceUsd: number;
  active: boolean;
}
