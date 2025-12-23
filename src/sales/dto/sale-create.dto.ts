import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { SaleDetailCreateDTO } from './sale-create-detail.dto';

export enum payMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
}

export class SaleCreateDTO {
  @IsEnum(payMethod)
  payMethod: payMethod = payMethod.CASH;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  tipoCambio?: number = 1;

  //@IsUUID()
  //@IsNotEmpty()
  //usuarioId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleDetailCreateDTO)
  detalles: SaleDetailCreateDTO[];
}
