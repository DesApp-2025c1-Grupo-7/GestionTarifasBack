import { Test, TestingModule } from '@nestjs/testing';
import { TransportistaService } from './transportista.service';

describe('TransportistaService', () => {
  let service: TransportistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportistaService],
    }).compile();

    service = module.get<TransportistaService>(TransportistaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
