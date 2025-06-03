import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TransportistaService } from '../services/transportista.service';
import { Transportista } from '../entities/transportista.entity';

@Controller('transportista')
export class TransportistaController {

    constructor(private readonly transportistaService:TransportistaService){}

    
    @HttpCode(HttpStatus.OK)
    @Get()
    async obtenerTransportistas(): Promise<Transportista[]>{
        return this.transportistaService.obtenerTransportistas()
    }
    



}
