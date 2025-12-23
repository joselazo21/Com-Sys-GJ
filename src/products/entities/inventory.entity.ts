import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column('int', { default: 0 })
  cantidad: number;

  @Column('int', { name: 'stock_minimo', default: 10 })
  stockMinimo: number;

  @Column('int', { name: 'stock_maximo', default: 100 })
  stockMaximo: number;

  @Column('varchar', { length: 50, default: 'ALMACEN_PRINCIPAL' })
  ubicacion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ultimaActualizacion: Date;

  // Métodos de negocio
  necesitaReposicion(): boolean {
    return this.cantidad <= this.stockMinimo;
  }

  excedeMaximo(): boolean {
    return this.cantidad > this.stockMaximo;
  }

  getPorcentajeStock(): number {
    return (this.cantidad / this.stockMaximo) * 100;
  }
}
