import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
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

    @Patch(':id/eliminar')
    async eliminarTipoVehiculo(@Param('id') id: number) {
        await this.tipoVehiculoService.eliminarTipoVehiculo(id);
        return { message: 'Tipo de vehículo eliminado correctamente' };
    }

    @Put(':id')
    async actualizarTipoVehiculo(@Param('id') id: number,@Body() body: CreateTipoVehiculoDTO) {
        return await this.tipoVehiculoService.actualizarTipoVehiculo(id, body);
    }

}
