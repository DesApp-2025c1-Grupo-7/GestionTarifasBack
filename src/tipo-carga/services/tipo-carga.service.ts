import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCarga } from '../entities/tipo-carga.entity';
import { Repository } from 'typeorm';
import { TipoCargaDTO } from '../dtos/tipo-carga.dto';

@Injectable()
export class TipoCargaService {

    constructor(@InjectRepository(TipoCarga) private readonly cargaRepository:Repository<TipoCarga>){}

    private readonly logger = new Logger(TipoCargaService.name)

    
    public async obtenerCargas(): Promise<TipoCarga[]> {

        const cargas : TipoCarga[] = await this.cargaRepository.find()

        return cargas
    }

    public async obtenerCarga(cargaId:number): Promise<TipoCarga>{
        try{
            const cargaExistente = await this.cargaRepository.findOne({where: {id:cargaId}})

            if(!cargaExistente){
                throw new BadRequestException(`El tipo de carga con el id ${cargaId} no existe`)
            }

            return cargaExistente
        } catch (error) {
            this.logger.error("Error al obtener el tipo de carga", error.stack)

            if( error instanceof BadRequestException){
                throw error
            }

            throw new InternalServerErrorException('Ocurrió un error al buscar el tipo de carga. Intente nuevamente.');
        }
    }


    public async crearTipoCarga(body: TipoCargaDTO): Promise<TipoCarga> {
        try {
            const cargaExistente = await this.cargaRepository.findOne({
                where: {
                    categoria: body.categoria,
                    requisitoEspecial: body.requisitoEspecial,
                    pesoTotal: body.pesoTotal,
                    volumenTotal: body.volumenTotal,
                    valorBase: body.valorBase,
                },
            });

            if (cargaExistente) {
                throw new ConflictException('Ya existe un tipo de carga con esos mismos valores.');
            }

            const nuevaCarga = this.cargaRepository.create(body);
            return await this.cargaRepository.save(nuevaCarga);
        } catch (error) {
            this.logger.error('Error al guardar el tipo de carga', error.stack);

            if (error instanceof ConflictException){
                throw error
            }

            throw new InternalServerErrorException('Ocurrió un error al guardar el tipo de carga. Intente nuevamente.');
        }
    }

    

    public async softDelete(cargaId: number): Promise<TipoCarga> {
        try {
            const cargaExistente: TipoCarga | null = await this.cargaRepository.findOne({
                where: { id: cargaId }
            });

            if (!cargaExistente) {
                throw new BadRequestException(`Carga con id ${cargaId} no encontrada.`);
            }

            cargaExistente.deletedAt = new Date();
            return await this.cargaRepository.save(cargaExistente);

        } catch (error) {
            this.logger.error(`Error al realizar el delete del id ${cargaId}`,error.stack);
       
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Ocurrió un error inesperado al realizar el delete.');
        }
    } 


}
