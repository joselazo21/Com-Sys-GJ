import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { SaleCreateDTO } from './dto/sale-create.dto';
import { Product } from 'src/products/entities/product.entity';
import { SalesReportDTO } from './dto/sales-report.dto';
import { SailDetailCreateDTO } from './dto/sale-create-detail.dto';
import { Inventory } from 'src/products/entities/inventory.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly ventaRepository: Repository<Sale>,

    @InjectRepository(SaleDetail)
    private readonly detalleRepository: Repository<SaleDetail>,

    @InjectRepository(Product)
    private readonly productoRepository: Repository<Product>,

    @InjectRepository(Inventory)
    private readonly inventarioRepository: Repository<Inventory>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createVentaDto: SaleCreateDTO) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verificar productos y stock
      const detallesConProductos = await this.verificarProductosYStock(
        createVentaDto.detalles,
      );

      // 2. Crear venta
      const venta = this.ventaRepository.create({
        metodoPago: createVentaDto.payMethod,
      });

      // 3. Crear detalles y calcular subtotales
      const detalles = detallesConProductos.map((detalleDto) => {
        const detalle = this.detalleRepository.create({
          ...detalleDto,
          productId: detalleDto.producto.id,
          unitPrice: detalleDto.producto.salePriceCup, //duda con esta asignacion de precio aqui
        });
        detalle.calcularSubtotal();
        return detalle;
      });

      venta.details = detalles;
      venta.calcularTotales(createVentaDto.tipoCambio);

      // 4. Actualizar inventario (reducir stock)
      await this.actualizarInventario(detalles, queryRunner);

      // 5. Guardar todo en transacción
      const ventaGuardada = await queryRunner.manager.save(venta);

      await queryRunner.commitTransaction();

      return await this.findOne(ventaGuardada[0].id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al crear venta: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private async verificarProductosYStock(detailsDTO: SailDetailCreateDTO[]) {
    const resultados = await Promise.all(
      detailsDTO.map(async (detailsDTO) => {
        const producto = await this.productoRepository.findOne({
          where: { id: detailsDTO.productID },
          relations: ['inventario'],
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto con ID ${detailsDTO.productID} no encontrado`,
          );
        }

        if (
          !producto.inventory ||
          producto.inventory.cantidad < detailsDTO.quantity
        ) {
          throw new BadRequestException(
            `Stock insuficiente para producto: ${producto.name}`,
          );
        }

        return { ...detailsDTO, producto };
      }),
    );

    return resultados;
  }

  private async actualizarInventario(details: SaleDetail[], queryRunner: any) {
    for (const detail of details) {
      await queryRunner.manager.decrement(
        Inventory,
        { productId: detail.productId },
        'quantity',
        detail.quantity,
      );
    }
  }

  async findAll() {
    return await this.ventaRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fechaVenta: 'DESC' },
    });
  }

  async findOne(id: string) {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  async getVentasPorProducto(productId: string) {
    return await this.detalleRepository.find({
      where: { productId },
      relations: ['sale'],
    });
  }

  async getTotalesPorPeriodo(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<SalesReportDTO[]> {
    const queryBuilder = this.ventaRepository
      .createQueryBuilder('venta')
      .select('DATE(venta.fecha_venta)', 'fecha')
      .addSelect('SUM(venta.total_mn)', 'total_dia_mn')
      .addSelect('SUM(venta.total_mlc)', 'total_dia_mlc')
      .addSelect('COUNT(venta.id)', 'cantidad_ventas')
      .where('venta.fecha_venta BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .groupBy('DATE(venta.fecha_venta)')
      .orderBy('fecha', 'ASC');

    const rawResults = await queryBuilder.getRawMany();

    return rawResults.map((raw) => new SalesReportDTO(raw));
  }
}
