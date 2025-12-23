import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from 'src/categories/entities/categories.entity';
import { SaleDetail } from 'src/sales/entities/sale-detail.entity';
import { Inventory } from 'src/products/entities/inventory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  category: string;

  @Column({ type: 'integer' })
  units: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'purchase_price_cup',
  })
  purchasePriceCup: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'purchase_price_usd',
  })
  purchasePriceUsd: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'sale_price_cup',
  })
  salePriceCup: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'sale_price_usd',
  })
  salePriceUsd: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'inventory_id' })
  inventoryID: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  //Relationships
  @JoinTable()
  @ManyToMany(() => Category, (category) => category.products)
  categories: Category[];

  @OneToMany(() => SaleDetail, (detail) => detail.product)
  saleDetails: SaleDetail[];
}
