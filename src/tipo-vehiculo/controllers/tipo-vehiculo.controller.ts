import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { TipoVehiculoService } from '../services/tipo-vehiculo.service';
import { CreateTipoVehiculoDTO } from '../dtos/tipo-vehiculo.dto';

@Controller('tipo-vehiculo')
export class TipoVehiculoController {

    constructor(private readonly tipoVehiculoService: TipoVehiculoService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerTipoVehiculos(): Promise<TipoVehiculo[]>{
        return this.tipoVehiculoService.obtenerTipoVehiculos()
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async obtenerCarga(@Param('id') id:number): Promise<TipoVehiculo> {
        return this.tipoVehiculoService.obtenerTipoVehiculo(id)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async crearTipoVehiculos(@Body() body:CreateTipoVehiculoDTO){
        return this.tipoVehiculoService.crearTipoVehiculo(body)
    }





}
