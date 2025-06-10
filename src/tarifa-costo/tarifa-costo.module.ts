import { Module } from '@nestjs/common';
import { TarifaCostoController } from './tarifa-costo.controller';
import { TarifaCostoService } from './tarifa-costo.service';

@Module({
  controllers: [TarifaCostoController],
  providers: [TarifaCostoService]
})
export class TarifaCostoModule {}
