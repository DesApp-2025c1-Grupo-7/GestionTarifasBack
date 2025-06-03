import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { TransportistaService } from '../services/transportista.service';
import { Transportista } from '../entities/transportista.entity';
import { CreateTransportistaDto } from '../dtos/transportista.dto';

@Controller('transportista')
export class TransportistaController {

    constructor(private readonly transportistaService:TransportistaService){}

    
    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerTransportistas(): Promise<Transportista[]>{
        return this.transportistaService.obtenerTransportistas()
    }
    
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async obtenerTransportista(@Param('id') id:number): Promise<Transportista>{
        return this.transportistaService.obtenerTransportista(id)
    }


    @HttpCode(HttpStatus.CREATED)
    @Post()
    async crearTransportista(@Body() body:CreateTransportistaDto):Promise<Transportista>{
        return await this.transportistaService.crearTransportista(body)
    }


    @Put(':id')
    async actualizarTransportista(@Param('id') id: number,@Body() body: CreateTransportistaDto) {
        return await this.transportistaService.actualizarTransportista(id, body);
    }

    @Patch(':id/eliminar')
    async eliminarTransportista(@Param('id') id: number) {
        await this.transportistaService.eliminarTransportista(id);
        return { message: 'Transportista eliminado correctamente' };
    }

}
