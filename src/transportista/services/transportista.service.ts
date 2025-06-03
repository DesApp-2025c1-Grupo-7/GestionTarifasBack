import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transportista } from '../entities/transportista.entity';
import { In, Repository } from 'typeorm';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { CreateTransportistaDto } from '../dtos/transportista.dto';

@Injectable()
export class TransportistaService {
    
    constructor(@InjectRepository(Transportista) private readonly transportistaRep:Repository<Transportista>,
                @InjectRepository(Vehiculo) private readonly vehiculoRepository:Repository<Vehiculo>){}

    private readonly logger = new Logger(TransportistaService.name)


    async obtenerTransportistas():Promise<Transportista[]>{
        const transportistas = await this.transportistaRep.find({relations:['vehiculos','vehiculos.tipoVehiculo','vehiculos.tipoVehiculo.tipoCargas']})
    
        return transportistas
    }


    async obtenerTransportista(idTransportista:number): Promise<Transportista> {
        try {
            const transportistaExist = await this.transportistaRep.findOne({where: {id:idTransportista},relations:['vehiculos','vehiculos.tipoVehiculo','vehiculos.tipoVehiculo.tipoCargas']}) 
                                                                                   
            if(!transportistaExist){
                throw new BadRequestException(`El tipo transportista con el id ${idTransportista} no existe`)
            }
    
            return transportistaExist
        } catch (error){
            this.logger.error("Error al obtener el transportista",error.stack)
    
            if( error instanceof BadRequestException){
                throw error
            }
                
            throw new InternalServerErrorException('Ocurrió un error al buscar el transportista. Intente nuevamente.');
        }
            
    }



    async crearTransportista(body:CreateTransportistaDto):Promise<Transportista>{
        try{
            const transportistaExist = await this.transportistaRep.findOne({where: {nombre:body.nombre}})

            if(transportistaExist){
                throw new BadRequestException("Ya existe una empresa con ese nombre")
            }

            const vehiculos = await this.vehiculoRepository.findBy({id: In(body.vehiculos)});


            if (vehiculos.length !== body.vehiculos.length) {
                throw new BadRequestException("Uno o más vehículos no existen ");
            }

            const nuevoTransportista = this.transportistaRep.create({
                nombre: body.nombre,
                contacto: body.contacto,
                telefono: body.telefono,
                costoServicio: body.costoServicio,
                vehiculos: vehiculos
            });

            return await this.transportistaRep.save(nuevoTransportista);
        }catch(error){
            this.logger.error('Error al crear transportista', error.stack);

            if( error instanceof BadRequestException){
                throw error
            }

            throw new InternalServerErrorException("No se pudo crear el transportista");
        }
    }


    async actualizarTransportista(id:number,body:CreateTransportistaDto):Promise<Transportista>{
        try{
            const transportistaExist = await this.transportistaRep.findOne({where:{id:id}})

            if(!transportistaExist){
                throw new BadRequestException(`El transportista con id ${id} no existe`)
            }

            const vehiculos = await this.vehiculoRepository.findBy({ id: In(body.vehiculos) });
            
            if (vehiculos.length !== body.vehiculos.length) {
                throw new BadRequestException("Uno o más vehículos no existen");
            }

            transportistaExist.vehiculos = vehiculos;
            transportistaExist.nombre = body.nombre 
            transportistaExist.contacto = body.contacto 
            transportistaExist.telefono = body.telefono         
            transportistaExist.costoServicio = body.costoServicio

            return await this.transportistaRep.save(transportistaExist);

        } catch(error){
            this.logger.error('Error al actualizar transportista', error.stack);
            
            if (error instanceof BadRequestException){ 
                throw error;
            }
            
            throw new InternalServerErrorException('No se pudo actualizar el transportista');
        }
    }


    async eliminarTransportista(id: number): Promise<Transportista> {
        try {
            const transportistaExist = await this.transportistaRep.findOne({ where: { id } });
    
            if (!transportistaExist) {
                throw new NotFoundException('Transportista no encontrado');
            }
    
            transportistaExist.deletedAt = new Date();
    
            return await this.transportistaRep.save(transportistaExist);
        } catch (error) {
            this.logger.error('Error al eliminar transportista', error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('No se pudo eliminar el transportista');
        }
    }

}
