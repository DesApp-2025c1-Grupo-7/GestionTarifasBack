import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateZonaDeViaje} from '../dto/zona-de-viaje.dto';
import { Repository } from 'typeorm';
import { ZonaDeViaje } from '../entities/zona-de-viaje.entity';
import { throwError } from 'rxjs';

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



    async actualizarZonaViaje(id:number,body:CreateZonaDeViaje):Promise<ZonaDeViaje>{
        try{
            const zonaExist = await this.zonaRepository.findOne({where: {id:id}})

            if(!zonaExist){
                throw new BadRequestException(`La zona de viaje con el id ${id} no existe`)
            }

            zonaExist.origen = body.origen
            zonaExist.destino = body.destino
            zonaExist.distancia = body.distancia
            zonaExist.costoKilometro = body.costoKilometro

            return await this.zonaRepository.save(zonaExist)

        } catch (error){
            this.logger.error('Error al actualizar zona de viaje', error.stack);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('No se pudo actualizar la zona de viaje');
        }
    }


    async softDelete(id:number):Promise<ZonaDeViaje>{
        try{
            const zonaExist = await this.zonaRepository.findOne({where: {id:id}})

            if(!zonaExist){
                throw new BadRequestException(`La zona de viaje con el id ${id} no existe`)
            }

            zonaExist.deletedAt = new Date()

            return await this.zonaRepository.save(zonaExist);

        } catch (error){
            this.logger.error('Error al realizar soft delete de zona de viaje', error.stack);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('No se pudo eliminar la zona de viaje');
        }
    }



}
