import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adicional } from '../entities/adicional.entity';
import { CreateAdicionalDTO } from '../dtos/adicional.dto';

@Injectable()
export class AdicionalService {
  constructor(
    @InjectRepository(Adicional)
    private readonly adicionalRepository: Repository<Adicional>,
  ) {}

  async create(dto: CreateAdicionalDTO): Promise<Adicional> {
    const adicional = this.adicionalRepository.create(dto);
    return await this.adicionalRepository.save(adicional);
  }

  async findAll(): Promise<Adicional[]> {
    return await this.adicionalRepository.find();
  }

  async findOne(id: number): Promise<Adicional> {
    const adicional = await this.adicionalRepository.findOneBy({ idAdicional: id });
    if (!adicional) throw new NotFoundException(`No se encontró el adicional con ID ${id}`);
    return adicional;
  }

  async update(id: number, dto: CreateAdicionalDTO): Promise<Adicional> {
    const adicional = await this.findOne(id);
    const actualizado = this.adicionalRepository.merge(adicional, dto);
    return await this.adicionalRepository.save(actualizado);
  }

  async eliminar(id: number): Promise<void> {
    await this.adicionalRepository.softDelete(id);
  }
} 
