import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SaleDetail } from './sale-detail.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'fecha_venta' })
  fechaVenta: Date;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_mlc' })
  totalMlc: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_mn' })
  totalMn: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'metodo_pago',
    default: 'EFECTIVO',
  })
  metodoPago: string;

  //@Column({ name: 'usuario_id' })
  //usuarioId: string;

  // Relaciones
  //anyToOne(() => Usuario, (usuario) => usuario.ventas)
  //@JoinColumn({ name: 'usuario_id' })
  //usuario: Usuario;

  @OneToMany(() => SaleDetail, (detail) => detail.sale, {
    cascade: true,
    eager: true,
  })
  details: SaleDetail[];

  // Método para calcular totales
  calcularTotales(tipoCambio: number = 1) {
    if (this.details && this.details.length > 0) {
      const subtotal = this.details.reduce(
        (sum, details) => sum + details.quantity * details.unitPrice,
        0,
      );

      this.totalMn = subtotal;
      this.totalMlc = subtotal / tipoCambio;
    }
  }
}
