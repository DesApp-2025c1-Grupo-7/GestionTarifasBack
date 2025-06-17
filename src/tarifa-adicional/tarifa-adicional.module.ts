import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaAdicional } from './entities/tarifa-adicional.entity';
import { TarifaAdicionalService } from './services/tarifa-adicional.service';
import { TarifaAdicionalController } from './controllers/tarifa-adicional.controller';
import { TarifaCosto } from '../tarifa-costo/entities/tarifa-costo.entity';
import { Adicional } from '../adicional/entities/adicional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TarifaAdicional,Adicional])],
  controllers: [TarifaAdicionalController],
  providers: [TarifaAdicionalService],
})
export class TarifaAdicionalModule {}
