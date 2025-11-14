export class ProductResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precioCompraCup: number;
  precioCompraUsd: number;
  precioVentaCup: number;
  precioVentaUsd: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
