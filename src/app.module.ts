import { Module } from '@nestjs/common';
import { TipoCargaModule } from './tipo-carga/tipo-carga.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TipoCargaModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
