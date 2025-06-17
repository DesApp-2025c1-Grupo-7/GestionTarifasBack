import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarifaAdicional } from '../entities/tarifa-adicional.entity';
import { CreateTarifaAdicionalDTO } from '../dtos/tarifa-adicional.dto';
import { TarifaCosto } from '../../tarifa-costo/entities/tarifa-costo.entity';
import { Adicional } from '../../adicional/entities/adicional.entity';

@Injectable()
export class TarifaAdicionalService {
  constructor(
    @InjectRepository(TarifaAdicional)
    private readonly taRepo: Repository<TarifaAdicional>,

    @InjectRepository(TarifaCosto)
    private readonly tarifaRepo: Repository<TarifaCosto>,

    @InjectRepository(Adicional)
    private readonly adicionalRepo: Repository<Adicional>
  ) {}

  async create(dto: CreateTarifaAdicionalDTO): Promise<TarifaAdicional> {
    const tarifa = await this.tarifaRepo.findOneBy({ id: dto.tarifaId });
    const adicional = await this.adicionalRepo.findOneBy({ idAdicional: dto.adicionalId });

    if (!tarifa || !adicional) {
      throw new NotFoundException('Tarifa o Adicional no encontrados');
    }

    const ta = new TarifaAdicional();
    ta.tarifa = tarifa;
    ta.adicional = adicional;
    ta.costoPersonalizado = dto.costoPersonalizado !== undefined ? dto.costoPersonalizado : 0;

return this.taRepo.save(ta);
  }

  findAll(): Promise<TarifaAdicional[]> {
    return this.taRepo.find({ relations: ['tarifa', 'adicional'] });
  }

  async findOne(id: number): Promise<TarifaAdicional> {
    const ta = await this.taRepo.findOne({
      where: { id },
      relations: ['tarifa', 'adicional']
    });
    if (!ta) throw new NotFoundException(`No se encontró el vínculo con ID ${id}`);
    return ta;
  }

  async update(id: number, dto: CreateTarifaAdicionalDTO): Promise<TarifaAdicional> {
    const ta = await this.findOne(id);

    ta.costoPersonalizado = dto.costoPersonalizado !== undefined ? dto.costoPersonalizado : 0;

    if (dto.tarifaId !== ta.tarifa.id) {
      const tarifa = await this.tarifaRepo.findOneBy({ id: dto.tarifaId });
      if (!tarifa) throw new NotFoundException('Tarifa no encontrada');
      ta.tarifa = tarifa;
    }

    if (dto.adicionalId !== ta.adicional.idAdicional) {
      const adicional = await this.adicionalRepo.findOneBy({ idAdicional: dto.adicionalId });
      if (!adicional) throw new NotFoundException('Adicional no encontrado');
      ta.adicional = adicional;
    }

    return this.taRepo.save(ta);
  }

  async remove(id: number): Promise<void> {
    const ta = await this.findOne(id);
    await this.taRepo.remove(ta);
  }
}
