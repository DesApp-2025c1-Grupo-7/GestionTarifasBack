import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { VehiculoService } from '../services/vehiculo.service';
import { Vehiculo } from '../entities/vehiculo.entity';
import { CreateVehiculoDto } from '../dtos/vehiculo.dto';

@Controller('vehiculo')
export class VehiculoController {

    constructor(private readonly vehiculoService:VehiculoService){}

    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerVehiculos():Promise<Vehiculo[]> {
        return this.vehiculoService.obtenerVehiculos()
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async obtenerVehiculo(@Param('id') id:number):Promise<Vehiculo> {
        return this.vehiculoService.obtenerVehiculo(id)
    }

    
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async crearVehiculos(@Body() body:CreateVehiculoDto){
        return this.vehiculoService.crearVehiculo(body)
    }
    
    @Put(':id')async actualizarVehiculo(@Param('id') id: number,@Body() body: CreateVehiculoDto): Promise<Vehiculo> {
        return this.vehiculoService.actualizarVehiculo(id, body);
    }

    @Patch(':id/eliminar')
    async eliminarVehiculo(@Param('id') id: number) {
        await this.vehiculoService.eliminarVehiculo(id);
        return { message: 'Vehículo eliminado correctamente' };
    }


}
