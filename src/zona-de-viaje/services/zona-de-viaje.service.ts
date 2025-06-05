import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateZonaDeViaje} from '../dto/zona-de-viaje.dto';
import { Repository } from 'typeorm';
import { ZonaDeViaje } from '../entities/zona-de-viaje.entity';

@Injectable()
export class ZonaDeViajeService {

    constructor(@InjectRepository(ZonaDeViaje) private readonly zonaRepository:Repository<ZonaDeViaje>){}

    private readonly logger = new Logger(ZonaDeViajeService.name)


    async obtenerZonas():Promise<ZonaDeViaje[]>{
        const zonasDeViaje = await this.zonaRepository.find()
        
        return zonasDeViaje
    }

    async crearZonaViaje(body: CreateZonaDeViaje): Promise<ZonaDeViaje> {
        try {
            const zonaExist = await this.zonaRepository.findOne({
                where: {
                    origen: body.origen,
                    destino: body.destino,
                    distancia: body.distancia,
                    costoKilometro: body.costoKilometro,
                },
            });

            if (zonaExist) {
                throw new BadRequestException("Ya existe una zona de viaje con las mismas características");
            }

            const nuevaZona = this.zonaRepository.create({
                origen: body.origen,
                destino: body.destino,
                distancia: body.distancia,
                costoKilometro: body.costoKilometro,
            });

            return await this.zonaRepository.save(nuevaZona);

        } catch (error) {
            this.logger.error('Error al crear zona de viaje', error.stack);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException("No se pudo crear la zona de viaje");
        }
    }


}
