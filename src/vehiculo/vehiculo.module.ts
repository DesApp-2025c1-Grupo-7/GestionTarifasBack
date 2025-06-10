import { Module } from '@nestjs/common';
import { VehiculoController } from './controllers/vehiculo.controller';
import { VehiculoService } from './services/vehiculo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { TipoVehiculoModule } from 'src/tipo-vehiculo/tipo-vehiculo.module';
import { TarifaCosto } from 'src/tarifa-costo/entities/tarifa-costo.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Vehiculo, TipoVehiculo, TarifaCosto]),
    TipoVehiculoModule
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [TypeOrmModule]
})
export class VehiculoModule {}
