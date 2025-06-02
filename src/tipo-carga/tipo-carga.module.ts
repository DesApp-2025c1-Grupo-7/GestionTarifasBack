import { Module } from '@nestjs/common';
import { TipoCargaService } from './services/tipo-carga.service';
import { TipoCargaController } from './controllers/tipo-carga.controller';
import { TipoCarga } from './entities/tipo-carga.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([TipoCarga])],
  providers: [TipoCargaService],
  controllers: [TipoCargaController],
  exports: [TypeOrmModule]
})
export class TipoCargaModule {}
