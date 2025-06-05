import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
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


}
