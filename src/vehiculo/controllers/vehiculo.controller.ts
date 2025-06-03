import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { VehiculoService } from '../services/vehiculo.service';
import { Vehiculo } from '../entities/vehiculo.entity';

@Controller('vehiculo')
export class VehiculoController {

    constructor(private readonly vehiculoService:VehiculoService){}

    @HttpCode(HttpStatus.OK)
    @Get()
    obtenerVehiculos():Promise<Vehiculo[]> {
            return this.vehiculoService.obtenerVehiculos()
    }
    
    



}
