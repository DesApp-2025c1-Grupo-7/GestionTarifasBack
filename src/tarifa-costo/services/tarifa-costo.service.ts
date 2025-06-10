import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TarifaCosto } from '../entities/tarifa-costo.entity';
import { Repository } from 'typeorm';
import { TarifaCostoDTO } from  '../dtos/tarifa-costo.dto';

@Injectable()
export class TarifaCostoService {
    // Aquí puedes implementar los métodos necesarios para manejar la lógica de negocio relacionada con las tarifas y costos.
    // Por ejemplo, podrías tener métodos para crear, actualizar, eliminar y obtener tarifas de costo.
    
    constructor(@InjectRepository(TarifaCosto) private readonly tarifaCostoRepository:Repository<TarifaCosto>){}
    
        private readonly logger = new Logger(TarifaCostoService.name )

    public async obtenerTarifasCosto(): Promise<TarifaCosto[]> {

        const tarifasCosto: TarifaCosto[] = await this.tarifaCostoRepository.find({ 
            relations: ['zonaDeViaje', 'vehiculo', 'transportista', 'vehiculo.tipoVehiculo'],
        });

        return tarifasCosto;
    }

    public async crearTarifaCosto(body: TarifaCostoDTO): Promise<TarifaCosto> {
        try {
            const tarifaCostoExist = await this.tarifaCostoRepository.findOne({ where: { id: body.tarifaCostoId } });
            if (tarifaCostoExist) {
                throw new BadRequestException("Ya existe una tarifa de costo con ese ID");
            }
            const tarifaCosto = await this.tarifaCostoRepository.findBy({id: body.tarifaCostoId});
            if (tarifaCosto.length === 0) {
                throw new BadRequestException("La tarifa de costo no existe");
            }
            const newTarifaCosto = this.tarifaCostoRepository.create({
                valor_base: body.valorBase,
            });
            return await this.tarifaCostoRepository.save(newTarifaCosto);

        } catch (error) {
            this.logger.error('Error al crear transportista', error);
            if( error instanceof BadRequestException){
                throw error
            }

            throw new InternalServerErrorException('Ocurrió un error al crear la tarifa de costo. Intente nuevamente.');
        }
    }
}
