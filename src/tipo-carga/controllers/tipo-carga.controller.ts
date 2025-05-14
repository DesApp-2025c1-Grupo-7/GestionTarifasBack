import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { TipoCargaService } from '../services/tipo-carga.service';
import { TipoCarga } from '../entities/tipo-carga.entity';
import { TipoCargaDTO } from '../dtos/tipo-carga.dto';

@Controller('tipo-carga')
export class TipoCargaController {
    
    constructor( private readonly cargaService:TipoCargaService){}

    @HttpCode(HttpStatus.OK)
    @Get('all')
    obtenerCargas():Promise<TipoCarga[]> {
        return this.cargaService.obtenerCargas()
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    obtenerCarga(@Param('id') id:number): Promise<TipoCarga> {
        return this.cargaService.obtenerCarga(id)
    }


    @HttpCode(HttpStatus.CREATED) 
    @Post()
    crearCarga(@Body() body:TipoCargaDTO){
        return this.cargaService.crearTipoCarga(body)
    }


    @Patch(':id/delete')
    async softDelete(@Param('id') cargaId: number) {
        return this.cargaService.softDelete(cargaId);
    }
    
}
