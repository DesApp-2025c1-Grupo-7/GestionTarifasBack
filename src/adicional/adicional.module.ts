import { Module } from '@nestjs/common';
import { Adicional } from './entities/adicional.entity';
import { AdicionalController } from './controllers/adicional.controller';
import { AdicionalService } from './services/adicional.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaCosto } from 'src/tarifa-costo/entities/tarifa-costo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';
import { TarifaAdicional } from '../tarifa-adicional/entities/tarifa-adicional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Adicional,
      TarifaAdicional, 
    ]),
  ],
  controllers: [AdicionalController],
  providers: [AdicionalService],
})
export class AdicionalModule {}