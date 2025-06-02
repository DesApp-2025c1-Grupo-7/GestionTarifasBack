import { Module } from '@nestjs/common';
import { TipoCargaModule } from './tipo-carga/tipo-carga.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/db.config';
import { TipoVehiculoModule } from './tipo-vehiculo/tipo-vehiculo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TipoCargaModule,
    TipoVehiculoModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
