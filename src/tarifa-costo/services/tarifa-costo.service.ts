import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TarifaCosto } from '../entities/tarifa-costo.entity';
import { Repository } from 'typeorm';
import { CreateTarifaCostoDTO } from  '../dtos/tarifa-costo.dto';
import { Transportista } from 'src/transportista/entities/transportista.entity';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';

@Injectable()
export class TarifaCostoService {

    constructor(@InjectRepository(TarifaCosto) private readonly tarifaCostoRepository:Repository<TarifaCosto>,
                @InjectRepository(Transportista) private readonly transportistaRepository:Repository<Transportista>,
                @InjectRepository(TipoVehiculo) private readonly vehiculoRepo:Repository<TipoVehiculo>,
                @InjectRepository(ZonaDeViaje) private readonly zonaRepository:Repository<ZonaDeViaje>){}
    

    private readonly logger = new Logger(TarifaCostoService.name )

    public async obtenerTarifasCosto(): Promise<TarifaCosto[]> {

        const tarifasCosto: TarifaCosto[] = await this.tarifaCostoRepository.find({ 
            relations: ['zonaDeViaje', 'tipoVehiculo', 'transportista', 'tipoVehiculo.tipoCargas'],
        });

        return tarifasCosto;
    }

    public async crearTarifaCosto(body: CreateTarifaCostoDTO): Promise<TarifaCosto> {
        try {

            const tipoVehiculo = await this.vehiculoRepo.findOne({ where: { id: body.tipoVehiculo } });

            if (!tipoVehiculo) {
                throw new BadRequestException('El tipo vehículo especificado no existe.');
            }

            const zonaDeViaje = await this.zonaRepository.findOne({ where: { id: body.zonaDeViaje } });
            if (!zonaDeViaje) {
                throw new BadRequestException('La zona de viaje especificada no existe.');
            }

            const transportista = await this.transportistaRepository.findOne({ where: { id: body.transportista } });
            if (!transportista) {
                throw new BadRequestException('El transportista especificado no existe.');
            }

            const tarifaExistente = await this.tarifaCostoRepository.findOne({
                where: {
                    tipoVehiculo: { id: body.tipoVehiculo },
                    zonaDeViaje: { id: body.zonaDeViaje },
                    transportista: { id: body.transportista },
                     valor_base: body.valorBase
                }
            });

            if (tarifaExistente) {
                throw new BadRequestException('Ya existe una tarifa de costo con las mismas características.');
            }

            const nuevaTarifa = this.tarifaCostoRepository.create({
                valor_base: body.valorBase,
                zonaDeViaje,
                tipoVehiculo,
                transportista
            });

            return await this.tarifaCostoRepository.save(nuevaTarifa);

        } catch (error) {
            this.logger.error('Error al crear transportista', error);
            if( error instanceof BadRequestException){
                throw error
            }

            throw new InternalServerErrorException('Ocurrió un error al crear la tarifa de costo. Intente nuevamente.');
        }
    }

    public async eliminarTarifaCosto(id: number): Promise<TarifaCosto> {
        try {
            const tarifa = await this.tarifaCostoRepository.findOne({ where: { id } });

            if (!tarifa) {
                throw new NotFoundException('Tarifa de costo no encontrada');
            }

            tarifa.deletedAt = new Date();

            return await this.tarifaCostoRepository.save(tarifa);
        } catch (error) {
            this.logger.error('Error al eliminar tarifa de costo', error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('No se pudo eliminar la tarifa de costo');
        }
    }   









}
