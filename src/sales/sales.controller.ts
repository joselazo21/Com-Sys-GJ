import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { SaleCreateDTO } from './dto/sale-create.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SocketAddress } from 'net';

@ApiTags('ventas')
@Controller('ventas')
export class SalesController {
  constructor(private readonly ventasService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o stock insuficiente',
  })
  create(@Body() createVentaDto: SaleCreateDTO) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener venta por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ventasService.findOne(id);
  }

  @Get('producto/:productoId')
  @ApiOperation({ summary: 'Obtener ventas por producto' })
  getVentasPorProducto(@Param('productoId', ParseUUIDPipe) productoId: string) {
    return this.ventasService.getVentasPorProducto(productoId);
  }

  @Get('reportes/totales')
  @ApiOperation({ summary: 'Reporte de totales por período' })
  getTotalesPorPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.ventasService.getTotalesPorPeriodo(inicio, fin);
  }
}
