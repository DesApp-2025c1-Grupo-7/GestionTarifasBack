import { Module } from '@nestjs/common';
import { TipoVehiculoService } from './services/tipo-vehiculo.service';
import { TipoVehiculoController } from './controllers/tipo-vehiculo.controller';
import { TipoCargaModule } from 'src/tipo-carga/tipo-carga.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([TipoVehiculo]),
    TipoCargaModule
  ],
  providers: [TipoVehiculoService],
  controllers: [TipoVehiculoController]
})
export class TipoVehiculoModule {}
