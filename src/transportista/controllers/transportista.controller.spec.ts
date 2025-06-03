import { Test, TestingModule } from '@nestjs/testing';
import { TransportistaController } from './transportista.controller';

describe('TransportistaController', () => {
  let controller: TransportistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportistaController],
    }).compile();

    controller = module.get<TransportistaController>(TransportistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
