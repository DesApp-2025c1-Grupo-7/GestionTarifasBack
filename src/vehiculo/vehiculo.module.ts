import { Module } from '@nestjs/common';
import { VehiculoController } from './controllers/vehiculo.controller';
import { VehiculoService } from './services/vehiculo.service';

@Module({
  controllers: [VehiculoController],
  providers: [VehiculoService]
})
export class VehiculoModule {}
