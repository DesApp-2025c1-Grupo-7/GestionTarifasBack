import { Module } from '@nestjs/common';
import { TransportistaService } from './services/transportista.service';
import { TransportistaController } from './controllers/transportista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transportista } from './entities/transportista.entity';
import { ZonaDeViajeModule } from 'src/zona-de-viaje/zona-de-viaje.module';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { TipoVehiculoModule } from 'src/tipo-vehiculo/tipo-vehiculo.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Transportista,TipoVehiculo,ZonaDeViaje]),
    TipoVehiculoModule,
    ZonaDeViajeModule
  ],
  providers: [TransportistaService],
  controllers: [TransportistaController]
})
export class TransportistaModule {}
