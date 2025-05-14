import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoCarga } from '../entities/tipo-carga.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoCargaService {

    constructor(@InjectRepository(TipoCarga) private readonly cargaRepository:Repository<TipoCarga>){}

    
    public async obtenerCargas(): Promise<TipoCarga[]> {

        const cargas : TipoCarga[] = await this.cargaRepository.find()

        return cargas
    }


    

    
}
