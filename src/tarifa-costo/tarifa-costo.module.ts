import { Module } from '@nestjs/common';
import { TarifaCostoController } from './controllers/tarifa-costo.controller';
import { TarifaCostoService } from './services/tarifa-costo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaCosto } from './entities/tarifa-costo.entity';
import { Transportista } from 'src/transportista/entities/transportista.entity';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TarifaCosto,
      Transportista,
      TipoVehiculo,           
      ZonaDeViaje,
      TipoCarga        
    ]),
  ],
  controllers: [TarifaCostoController],
  providers: [TarifaCostoService]
})
export class TarifaCostoModule {}
