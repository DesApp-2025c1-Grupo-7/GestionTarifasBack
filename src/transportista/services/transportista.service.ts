import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transportista } from '../entities/transportista.entity';
import { Repository } from 'typeorm';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';

@Injectable()
export class TransportistaService {
    
    constructor(@InjectRepository(Transportista) private readonly transportistaRep:Repository<Transportista>,
                @InjectRepository(Vehiculo) private readonly vehiculoRepository:Repository<Vehiculo>){}

    private readonly logger = new Logger(TransportistaService.name)


    async obtenerTransportistas():Promise<Transportista[]>{
        const transportistas = await this.transportistaRep.find({relations:['vehiculos','vehiculos.tipoVehiculo']})
    
        return transportistas
    }



}
