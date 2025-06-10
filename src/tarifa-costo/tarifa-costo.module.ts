import { Module } from '@nestjs/common';
import { TarifaCostoController } from './controllers/tarifa-costo.controller';
import { TarifaCostoService } from './services/tarifa-costo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaCosto } from './entities/tarifa-costo.entity';
import { Transportista } from 'src/transportista/entities/transportista.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TarifaCosto,
      Transportista,
      Vehiculo,           
      ZonaDeViaje         
    ]),
  ],
  controllers: [TarifaCostoController],
  providers: [TarifaCostoService]
})
export class TarifaCostoModule {}
