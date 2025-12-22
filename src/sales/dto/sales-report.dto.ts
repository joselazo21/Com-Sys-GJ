export class SalesReportDTO {
  fecha: string;
  total_dia_mn: number;
  total_dia_mlc: number;
  cantidad_ventas: number;

  constructor(raw: any) {
    this.fecha = raw.fecha;
    this.total_dia_mn = Number(raw.total_dia_mn) || 0;
    this.total_dia_mlc = Number(raw.total_dia_mlc) || 0;
    this.cantidad_ventas = Number(raw.cantidad_ventas) || 0;
  }
}
