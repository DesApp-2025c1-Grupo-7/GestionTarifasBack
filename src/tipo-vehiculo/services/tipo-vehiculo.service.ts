import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';
import { CreateTipoVehiculoDTO } from '../dtos/tipo-vehiculo.dto';

@Injectable()
export class TipoVehiculoService {

    constructor(@InjectRepository(TipoVehiculo) private readonly tipoVehiculoRep:Repository<TipoVehiculo>,
                @InjectRepository(TipoCarga) private readonly tipoCargaRepo:Repository<TipoCarga> ){}


    private readonly logger = new Logger(TipoVehiculoService.name)


    async obtenerTipoVehiculos(): Promise<TipoVehiculo[]> {
        try {
            const vehiculos = await this.tipoVehiculoRep.find({ relations: ['tipoCargas'] });
            return vehiculos;
        } catch (error) {
            this.logger.error("Error al obtener los tipo de vehiculos", error.stack);
            throw error; 
        }
    }

    async obtenerTipoVehiculo(idTipoVehiculo:number): Promise<TipoVehiculo> {
        try {
            const tipoVehiculoexist = await this.tipoVehiculoRep.findOne({where: {id:idTipoVehiculo}, relations:['tipoCargas']})

            if(!tipoVehiculoexist){
                throw new BadRequestException(`El tipo de vehiculo con el id ${idTipoVehiculo} no existe`)
            }

            return tipoVehiculoexist
        } catch (error){
            this.logger.error("Error al obtener el tipo vehiculo",error.stack)

            if( error instanceof BadRequestException){
                throw error
            }
            
            throw new InternalServerErrorException('Ocurrió un error al buscar el tipo de vehiculo. Intente nuevamente.');
        }
        
    }




    async crearTipoVehiculo(body: CreateTipoVehiculoDTO): Promise<TipoVehiculo> {
        try {
            const { descripcion, tipoCargas } = body;

            //duplicadas en el body
            const cargasUnicas = [...new Set(tipoCargas)];

            if (tipoCargas.length !== cargasUnicas.length) {
                throw new BadRequestException('No se permiten cargas duplicadas en la lista cargas');
            }

            // Buscar las cargas por ID
            const cargasRelacionadas = await this.tipoCargaRepo.findBy({id: In(cargasUnicas)});

            if (cargasRelacionadas.length !== cargasUnicas.length) {
                throw new BadRequestException('Algunas cargas no existen');
            }

            const nuevoTipoVehiculo = this.tipoVehiculoRep.create({
                descripcion,
                tipoCargas: cargasRelacionadas,
            });

            return await this.tipoVehiculoRep.save(nuevoTipoVehiculo);
        } catch (error) {
            this.logger.error('Error al crear tipo de vehículo', error.stack);
      
            if(error instanceof BadRequestException){
                throw error
            }
      
            throw new Error('No se pudo crear el tipo de vehículo');
        }
    }


    async eliminarTipoVehiculo(id: number): Promise<TipoVehiculo> {
        try {
            const tipoVehiculo = await this.tipoVehiculoRep.findOne({ where: { id } });

            if (!tipoVehiculo) {
                throw new NotFoundException('Tipo de vehículo no encontrado');
            }

            tipoVehiculo.deletedAt = new Date();

            return await this.tipoVehiculoRep.save(tipoVehiculo);
        } catch (error) {
            this.logger.error('Error al eliminar tipo de vehículo', error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('No se pudo eliminar el tipo de vehículo');
        }
    }


    public async actualizarTipoVehiculo(id: number, body: CreateTipoVehiculoDTO): Promise<TipoVehiculo> {
        try {
            const tipoVehiculo = await this.tipoVehiculoRep.findOne({ where: { id }, relations: ['tipoCargas'] });

            if (!tipoVehiculo) {
                throw new NotFoundException('Tipo de vehículo no encontrado');
            }

            const { descripcion, tipoCargas } = body;

            // Validar duplicados
            const cargasUnicas = [...new Set(tipoCargas)];
            if (tipoCargas.length !== cargasUnicas.length) {
                throw new BadRequestException('No se permiten cargas duplicadas');
            }

            // Validar existencia de cargas en DB
            const cargasRelacionadas = await this.tipoCargaRepo.findBy({ id: In(cargasUnicas) });
            if (cargasRelacionadas.length !== cargasUnicas.length) {
                throw new BadRequestException('Algunas cargas no existen');
            }

            // Actualizar campos
            tipoVehiculo.descripcion = descripcion;
            tipoVehiculo.tipoCargas = cargasRelacionadas;

            return await this.tipoVehiculoRep.save(tipoVehiculo);

        } catch (error) {
            this.logger.error('Error al actualizar tipo de vehículo', error.stack);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('No se pudo actualizar el tipo de vehículo');
        }
    }



}
