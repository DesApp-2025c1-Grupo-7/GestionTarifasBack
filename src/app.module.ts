import { Module } from '@nestjs/common';
import { TipoCargaModule } from './tipo-carga/tipo-carga.module';

@Module({
  imports: [TipoCargaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
