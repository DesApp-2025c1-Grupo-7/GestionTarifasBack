import { Injectable, Logger } from '@nestjs/common';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';
import { TipoCargaService } from 'src/tipo-carga/services/tipo-carga.service';

@Injectable()
export class TipoVehiculoService {

    constructor(@InjectRepository(TipoVehiculo) private readonly tipoVehiculoRep:Repository<TipoVehiculo>,
                @InjectRepository(TipoCarga) private readonly tipoCargaRepo:Repository<TipoCarga> ){}


    private readonly logger = new Logger(TipoVehiculoService.name)


    public async obtenerTipoVehiculos(): Promise<TipoVehiculo[]> {
        try {
            const vehiculos = await this.tipoVehiculoRep.find({ relations: ['tipoCargas'] });
            return vehiculos;
        } catch (error) {
            this.logger.error("Error al obtener los tipo de vehiculos", error.stack);
            throw error; 
        }
    }




}
