import { Module } from '@nestjs/common';
import { TransportistaService } from './services/transportista.service';
import { TransportistaController } from './controllers/transportista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { Transportista } from './entities/transportista.entity';
import { ZonaDeViajeModule } from 'src/zona-de-viaje/zona-de-viaje.module';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Transportista,Vehiculo,ZonaDeViaje]),
    VehiculoModule,
    ZonaDeViajeModule
  ],
  providers: [TransportistaService],
  controllers: [TransportistaController]
})
export class TransportistaModule {}
