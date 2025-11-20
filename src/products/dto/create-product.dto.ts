import { IsString, IsArray } from 'class-validator';

export class ProductCreateDto {
  code: string;
  name: string;
  description?: string;
  purchasePriceCup: number;
  purchasePriceUsd: number;
  salePriceCup: number;
  salePriceUsd: number;
  active: boolean;

  @IsString({ each: true })
  @IsArray()
  categories: string[];
}
