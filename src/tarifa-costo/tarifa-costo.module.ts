import { Module } from '@nestjs/common';
import { TarifaCostoController } from './controllers/tarifa-costo.controller';
import { TarifaCostoService } from './services/tarifa-costo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifaCosto } from './entities/tarifa-costo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TarifaCosto])],
  controllers: [TarifaCostoController],
  providers: [TarifaCostoService]
})
export class TarifaCostoModule {}
