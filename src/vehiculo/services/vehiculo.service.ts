import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehiculo } from '../entities/vehiculo.entity';
import { Repository } from 'typeorm';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';

@Injectable()
export class VehiculoService {

    constructor(@InjectRepository(Vehiculo) private readonly vehiculoRepository:Repository<Vehiculo>,
                @InjectRepository(TipoVehiculo) private readonly tipoVehiculoRep:Repository<TipoVehiculo>){}

    private readonly logger = new Logger(VehiculoService.name)

    async obtenerVehiculos():Promise<Vehiculo[]>{
        const vehiculos = await this.vehiculoRepository.find({relations: ['tipoVehiculo']})
        return vehiculos
    }
    


}
