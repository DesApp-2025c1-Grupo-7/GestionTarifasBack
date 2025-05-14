import { Module } from '@nestjs/common';
import { TipoCargaService } from './services/tipo-carga.service';
import { TipoCargaController } from './controllers/tipo-carga.controller';

@Module({
  providers: [TipoCargaService],
  controllers: [TipoCargaController]
})
export class TipoCargaModule {}
