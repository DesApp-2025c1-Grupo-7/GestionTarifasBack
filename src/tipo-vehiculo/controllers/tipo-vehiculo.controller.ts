import { Controller, Get } from '@nestjs/common';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { TipoVehiculoService } from '../services/tipo-vehiculo.service';

@Controller('tipo-vehiculo')
export class TipoVehiculoController {

    constructor(private readonly tipoVehiculoService: TipoVehiculoService) {}

    @Get()
    async obtenerTipoVehiculos(): Promise<TipoVehiculo[]>{
        return this.tipoVehiculoService.obtenerTipoVehiculos()
    }








}
