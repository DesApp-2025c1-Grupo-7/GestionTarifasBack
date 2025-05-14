import { Controller, Get } from '@nestjs/common';
import { TipoCargaService } from '../services/tipo-carga.service';
import { TipoCarga } from '../entities/tipo-carga.entity';

@Controller('tipo-carga')
export class TipoCargaController {
    
    constructor( private readonly cargaService:TipoCargaService){}

    
    @Get('all')
    obtenerCargas():Promise<TipoCarga[]> {
        return this.cargaService.obtenerCargas()
    }

    






}
