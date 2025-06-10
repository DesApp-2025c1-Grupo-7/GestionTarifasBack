import { Module } from '@nestjs/common';
import { ZonaDeViajeController } from './controllers/zona-de-viaje.controller';
import { ZonaDeViajeService } from './services/zona-de-viaje.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonaDeViaje } from './entities/zona-de-viaje.entity';
import { TarifaCosto } from 'src/tarifa-costo/entities/tarifa-costo.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ZonaDeViaje, TarifaCosto])],
  controllers: [ZonaDeViajeController],
  providers: [ZonaDeViajeService]
})
export class ZonaDeViajeModule {}
