import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
