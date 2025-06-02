import { Module } from '@nestjs/common';
import { TipoVehiculoService } from './services/tipo-vehiculo.service';
import { TipoVehiculoController } from './controllers/tipo-vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';
import { TipoCargaModule } from 'src/tipo-carga/tipo-carga.module';

@Module({
  imports: [ TypeOrmModule.forFeature([TipoVehiculo,TipoCarga]),
  TipoCargaModule
  ],
  providers: [TipoVehiculoService],
  controllers: [TipoVehiculoController]
})
export class TipoVehiculoModule {}
