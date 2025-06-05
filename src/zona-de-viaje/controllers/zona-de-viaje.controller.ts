import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { ZonaDeViajeService } from '../services/zona-de-viaje.service';
import { ZonaDeViaje } from '../entities/zona-de-viaje.entity';
import { CreateZonaDeViaje } from '../dto/zona-de-viaje.dto';

@Controller('zona-de-viaje')
export class ZonaDeViajeController {

    constructor(private readonly zonaService:ZonaDeViajeService){}

    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerZonas():Promise<ZonaDeViaje[]>{
        return this.zonaService.obtenerZonas()
    }
    

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async crearZonaViaje(@Body() body:CreateZonaDeViaje):Promise<ZonaDeViaje>{
        return await this.zonaService.crearZonaViaje(body)
    }


    @Put(':id')
    async actualizarZonaViaje(@Param('id') id: number,@Body() body: CreateZonaDeViaje) {
        return await this.zonaService.actualizarZonaViaje(id, body);
    }
    
    @Patch(':id/eliminar')
    async eliminarTransportista(@Param('id') id: number) {
    await this.zonaService.softDelete(id);
        return { message: 'Zona de viaje eliminada correctamente' };
    }
    

}
