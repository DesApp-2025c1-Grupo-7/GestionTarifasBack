import { Module } from '@nestjs/common';
import { ZonaDeViajeController } from './controllers/zona-de-viaje.controller';
import { ZonaDeViajeService } from './services/zona-de-viaje.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonaDeViaje } from './entities/zona-de-viaje.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ZonaDeViaje])],
  controllers: [ZonaDeViajeController],
  providers: [ZonaDeViajeService]
})
export class ZonaDeViajeModule {}
