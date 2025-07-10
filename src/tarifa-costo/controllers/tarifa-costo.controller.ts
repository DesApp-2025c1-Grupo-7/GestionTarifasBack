import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { CreateTarifaCostoDTO } from '../dtos/tarifa-costo.dto'; 
import { TarifaCostoService } from '../services/tarifa-costo.service';
import { TarifaCosto } from '../entities/tarifa-costo.entity';
import { TarifaCostoHistorial } from '../entities/tarifa-costo-historial.entity';




@Controller('tarifa-costo')
export class TarifaCostoController {

    constructor(private readonly tarifaCostoService: TarifaCostoService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerTarifasCosto(): Promise<TarifaCosto[]>{
        return this.tarifaCostoService.obtenerTarifasCosto()
    }

    // --- NUEVO ENDPOINT: Obtener una tarifa por su ID ---
    // Corresponde a la llamada GET /api/tarifa-costo/:id
    @Get(':id')
    async obtenerTarifaPorId(@Param('id') id: number): Promise<TarifaCosto> {
        return this.tarifaCostoService.obtenerTarifaPorId(id);
    }

    // --- NUEVO ENDPOINT: Obtener el historial de una tarifa ---
    // Corresponde a la llamada GET /api/tarifa-costo/historial/:id
    @Get('historial/:id')
    async obtenerHistorialDeTarifa(@Param('id') id: number): Promise<TarifaCostoHistorial[]> {
        return this.tarifaCostoService.obtenerHistorialDeTarifa(id);
    }
    
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createTarifaCosto(@Body() newTarifaCosto: CreateTarifaCostoDTO) {
       return this.tarifaCostoService.crearTarifaCosto(newTarifaCosto)                                               
    }

    @Patch(':id/eliminar')
    async eliminarTarifaCosto(@Param('id') id: number) {
        await this.tarifaCostoService.eliminarTarifaCosto(id);
        return { message: 'Tarifa costo eliminada correctamente' };
    }

    @Put(':id')
    async actualizarTarifaCosto(@Param('id') id: number, @Body() body:CreateTarifaCostoDTO) {
        return await this.tarifaCostoService.actualizarTarifaCosto(id,body);
    }

    // --- NUEVO ENDPOINT PARA ANÁLISIS COMPARATIVO ---
    @Get('analisis/comparativo')
    async getAnalisisComparativo(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.tarifaCostoService.getAnalisisComparativo(fechaInicio, fechaFin);
    }
}

