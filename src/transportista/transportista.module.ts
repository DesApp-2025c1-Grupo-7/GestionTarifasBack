import { Module } from '@nestjs/common';
import { TransportistaService } from './services/transportista.service';
import { TransportistaController } from './controllers/transportista.controller';

@Module({
  providers: [TransportistaService],
  controllers: [TransportistaController]
})
export class TransportistaModule {}
