import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
        const vehiculos = await this.vehiculoRepository.find({relations: ['tipoVehiculo','tipoVehiculo.tipoCargas', 'transportista']});
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


    async actualizarVehiculo(idVehiculo:number,body:CreateVehiculoDto):Promise<Vehiculo>{
        try {
            const vehiculoExiste = await this.vehiculoRepository.findOne({where: { id: idVehiculo },relations: ['tipoVehiculo', 'tipoVehiculo.tipoCargas'],});

            if (!vehiculoExiste) {
            throw new BadRequestException('Vehiculo con el ID buscado no existe');
            }

            // Validar que no exista otro vehículo con la misma patente
            const vehiculoConMismaPatente = await this.vehiculoRepository.findOne({where: { patente: body.patente }});

            if (vehiculoConMismaPatente && vehiculoConMismaPatente.id !== idVehiculo) {
            throw new BadRequestException(`Ya existe otro vehículo con la patente '${body.patente}'.`);
            }

            // Buscar el nuevo tipo de vehículo
            const tipoVehiculo = await this.tipoVehiculoRep.findOne({where: { id: body.tipoVehiculoId }});

            if (!tipoVehiculo) {
            throw new BadRequestException(`El tipo de vehículo con ID ${body.tipoVehiculoId} no existe.`);
            }

            // Actualizar los campos
            vehiculoExiste.patente = body.patente;
            vehiculoExiste.precioBase = body.precioBase;
            vehiculoExiste.tipoVehiculo = tipoVehiculo;

            return await this.vehiculoRepository.save(vehiculoExiste);    
        } catch (error) {
            this.logger.error('Error al actualizar el vehiculo', error.stack);

            if (error instanceof BadRequestException) {
            throw error;
            }

            throw new InternalServerErrorException('Ocurrió un error al actualizar el vehiculo.');
        }
    }


    async eliminarVehiculo(id: number): Promise<Vehiculo> {
        try {
            const vehiculoExistente = await this.vehiculoRepository.findOne({ where: { id } });
    
            if (!vehiculoExistente) {
                throw new NotFoundException('Vehículo no encontrado');
            }
    
            vehiculoExistente.deletedAt = new Date();
    
            return await this.vehiculoRepository.save(vehiculoExistente);
        } catch (error) {
            this.logger.error('Error al eliminar vehículo', error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('No se pudo eliminar el vehículo');
        }
    }


}




