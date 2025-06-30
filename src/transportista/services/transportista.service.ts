import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transportista } from '../entities/transportista.entity';
import { In, Repository } from 'typeorm';
import { CreateTransportistaDto } from '../dtos/transportista.dto';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';

@Injectable()
export class TransportistaService {
    
    constructor(@InjectRepository(Transportista) private readonly transportistaRep:Repository<Transportista>,
                @InjectRepository(TipoVehiculo) private readonly vehiculoRepository:Repository<TipoVehiculo>,
                @InjectRepository(ZonaDeViaje) private readonly zonaDeViajeRepo: Repository<ZonaDeViaje>){}

    private readonly logger = new Logger(TransportistaService.name)


    async obtenerTransportistas():Promise<Transportista[]>{
        const transportistas = await this.transportistaRep.find({
            relations:['tipoVehiculos','tipoVehiculos.tipoCargas','zonasDeViaje']})

        return transportistas
    }


    async obtenerTransportista(idTransportista:number): Promise<Transportista> {
        try {
            const transportistaExist = await this.transportistaRep.findOne({where: {id:idTransportista},
                relations:['tipoVehiculos','tipoVehiculo.tipoCargas','zonasDeViaje']})
                                                                                   
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

            const tipoVehiculos = await this.vehiculoRepository.findBy({id: In(body.tipoVehiculos)});

            if (tipoVehiculos.length !== body.tipoVehiculos.length) {
                throw new BadRequestException("Uno o más tipos vehículos no existen ");
            }


            const zonas = await this.zonaDeViajeRepo.findBy({ id: In(body.zonasDeViaje) });

            if (zonas.length !== body.zonasDeViaje.length) {
                throw new BadRequestException("Una o más zonas de viaje no existen");
            }



            const nuevoTransportista = this.transportistaRep.create({
                nombre: body.nombre,
                contacto: body.contacto,
                telefono: body.telefono,
                tipoVehiculos: tipoVehiculos,
                zonasDeViaje:zonas
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

            const tipoVehiculos = await this.vehiculoRepository.findBy({ id: In(body.tipoVehiculos) });
            
            if (tipoVehiculos.length !== body.tipoVehiculos.length) {
                throw new BadRequestException("Uno o más tipo vehículos no existen");
            }

            const zonas = await this.zonaDeViajeRepo.findBy({ id: In(body.zonasDeViaje) });

            if (zonas.length !== body.zonasDeViaje.length) {
                throw new BadRequestException("Una o más zonas de viaje no existen");
            }


            transportistaExist.tipoVehiculos = tipoVehiculos;
            transportistaExist.nombre = body.nombre 
            transportistaExist.contacto = body.contacto 
            transportistaExist.telefono = body.telefono         
            transportistaExist.zonasDeViaje = zonas

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
