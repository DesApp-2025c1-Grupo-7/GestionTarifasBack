import { Module } from '@nestjs/common';
import { TipoCargaModule } from './tipo-carga/tipo-carga.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/db.config';
import { TipoVehiculoModule } from './tipo-vehiculo/tipo-vehiculo.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TipoCargaModule,
    TipoVehiculoModule,
    VehiculoModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
