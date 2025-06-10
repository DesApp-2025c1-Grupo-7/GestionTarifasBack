import { Controller, Post, Body } from '@nestjs/common';
import { TarifaCostoDTO } from '../dtos/tarifa-costo.dto'; 
import { TarifaCostoService } from '../services/tarifa-costo.service';

// aca se define el controlador para manejar las rutas relacionadas con las tarifas de costo.

@Controller('tarifa-costo')
export class TarifaCostoController {

    constructor(private readonly tarifaCostoService: TarifaCostoService) {}

    @Post()
    createTarifaCosto(@Body() newTarifaCosto: TarifaCostoDTO) {
        // Aquí se implementaría la lógica para crear una nueva tarifa de costo.
        // Por ejemplo, podrías llamar a un servicio que maneje la creación de tarifas de costo.
       return this.tarifaCostoService.crearTarifaCosto(newTarifaCosto)
                                               
    }
}

