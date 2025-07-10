import { Module } from '@nestjs/common';
import { TarifaCostoController } from './controllers/tarifa-costo.controller';
import { TarifaCostoService } from './services/tarifa-costo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaCosto } from './entities/tarifa-costo.entity';
import { Transportista } from 'src/transportista/entities/transportista.entity';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';

// CAMBIO: Importar las entidades necesarias
import { TarifaAdicional } from '../tarifa-adicional/entities/tarifa-adicional.entity';
import { Adicional } from 'src/adicional/entities/adicional.entity';

// 1. Importar la nueva entidad de historial
import { TarifaCostoHistorial } from './entities/tarifa-costo-historial.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        TarifaCosto,
        TarifaCostoHistorial, // CAMBIO: Agregar la entidad de historial
        Transportista,
        TipoVehiculo,           
        ZonaDeViaje,
        TipoCarga,
        // CAMBIO: Se agregan los repositorios que usará el servicio
        TarifaAdicional,
        Adicional,
      ]),
  ],
  controllers: [TarifaCostoController],
  providers: [TarifaCostoService]
})
export class TarifaCostoModule {}