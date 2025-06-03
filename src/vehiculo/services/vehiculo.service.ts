import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehiculo } from '../entities/vehiculo.entity';
import { Repository } from 'typeorm';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { CreateVehiculoDto } from '../dtos/vehiculo.dto';

@Injectable()
export class VehiculoService {

    constructor(@InjectRepository(Vehiculo) private readonly vehiculoRepository:Repository<Vehiculo>,
                @InjectRepository(TipoVehiculo) private readonly tipoVehiculoRep:Repository<TipoVehiculo>){}

    private readonly logger = new Logger(VehiculoService.name)

    async obtenerVehiculos():Promise<Vehiculo[]>{
        const vehiculos = await this.vehiculoRepository.find({relations: ['tipoVehiculo','tipoVehiculo.tipoCargas']})
        return vehiculos
    }


    async obtenerVehiculo(idVehiculo:number):Promise<Vehiculo>{
        try{
            const vehiculoExiste = await this.vehiculoRepository.findOne({where:{id:idVehiculo}, relations:['tipoVehiculo','tipoVehiculo.tipoCargas']})

            if(!vehiculoExiste){
                throw new BadRequestException(`No existe un vehiculo con ese id`)
            }

            return vehiculoExiste
        } catch(error) {
            this.logger.error("Error al obtener el vehiculo",error.stack)

            if( error instanceof BadRequestException){
                throw error
            }
            
            throw new InternalServerErrorException('Ocurrió un error al buscar el vehiculo. Intente nuevamente.');
        }
    }


    async crearVehiculo(body:CreateVehiculoDto):Promise<Vehiculo>{
        try{
            const vehiculoExistente = await this.vehiculoRepository.findOne({where: {patente:body.patente}})
            
            if(vehiculoExistente){
                throw new BadRequestException(`Ya existe un vehiculo con la patente asociada ${body.patente}`)
            }

            // Obtener el TipoVehiculo correspondiente
            const tipoVehiculo = await this.tipoVehiculoRep.findOne({where: { id: body.tipoVehiculoId }});

            if (!tipoVehiculo) {
            throw new BadRequestException(
                `El tipo de vehículo con ID ${body.tipoVehiculoId} no existe.`);
            }

            const nuevoVehiculo = this.vehiculoRepository.create({
                patente: body.patente,
                precioBase: body.precioBase,
                tipoVehiculo: tipoVehiculo,
            });

            return await this.vehiculoRepository.save(nuevoVehiculo);
            
        } catch(error){
            this.logger.error("Error al crear el vehiculo",error.stack)

            if( error instanceof BadRequestException){
                throw error
            }

            throw new  InternalServerErrorException('Ocurrió un error al guardar el vehiculo. Intente nuevamente.');
        }
    }

}
