import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('sales_detail')
export class SaleDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sale_id' })
  saleID: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'unit_price',
  })
  unitPrice: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal: number;

  // Relaciones
  @ManyToOne(() => Sale, (sale) => sale.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'venta_id' })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.saleDetails)
  @JoinColumn({ name: 'producto_id' })
  product: Product;

  // Método para calcular subtotal
  calcularSubtotal() {
    this.subtotal = this.quantity * this.unitPrice;
    return this.subtotal;
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateSubtotal() {
    this.calcularSubtotal();
  }
}
