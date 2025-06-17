import { Module } from '@nestjs/common';
import { Adicional } from './entities/adicional.entity';
import { AdicionalController } from './controllers/adicional.controller';
import { AdicionalService } from './services/adicional.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaCosto } from 'src/tarifa-costo/entities/tarifa-costo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adicional])], 
  controllers: [AdicionalController],
  providers: [AdicionalService],
  exports: [TypeOrmModule],
})
export class AdicionalModule {}