import { Module } from '@nestjs/common';
import { ZonaDeViajeController } from './controllers/zona-de-viaje.controller';
import { ZonaDeViajeService } from './services/zona-de-viaje.service';

@Module({
  controllers: [ZonaDeViajeController],
  providers: [ZonaDeViajeService]
})
export class ZonaDeViajeModule {}
