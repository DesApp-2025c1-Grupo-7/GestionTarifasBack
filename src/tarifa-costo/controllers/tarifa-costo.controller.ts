import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CreateTarifaCostoDTO } from '../dtos/tarifa-costo.dto'; 
import { TarifaCostoService } from '../services/tarifa-costo.service';
import { TarifaCosto } from '../entities/tarifa-costo.entity';



@Controller('tarifa-costo')
export class TarifaCostoController {

    constructor(private readonly tarifaCostoService: TarifaCostoService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerTarifasCosto(): Promise<TarifaCosto[]>{
        return this.tarifaCostoService.obtenerTarifasCosto()
    }
    
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createTarifaCosto(@Body() newTarifaCosto: CreateTarifaCostoDTO) {
       return this.tarifaCostoService.crearTarifaCosto(newTarifaCosto)                                               
    }
}

