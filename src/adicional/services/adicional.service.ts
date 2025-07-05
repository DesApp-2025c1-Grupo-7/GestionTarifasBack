import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm'; // IsNull es necesario
import { Adicional } from '../entities/adicional.entity';
import { TarifaAdicional } from '../../tarifa-adicional/entities/tarifa-adicional.entity';
import { CreateAdicionalDTO } from '../dtos/adicional.dto';
import { TarifaCosto } from '../../tarifa-costo/entities/tarifa-costo.entity';

@Injectable()
export class AdicionalService {
  constructor(
    @InjectRepository(Adicional)
    private readonly adicionalRepository: Repository<Adicional>,
    
    @InjectRepository(TarifaAdicional)
    private readonly tarifaAdicionalRepository: Repository<TarifaAdicional>,
  ) {}

  // --- Métodos CRUD ---
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
    const adicional = await this.findOne(id);
    await this.adicionalRepository.softRemove(adicional);
  }

  // --- LÓGICA DEL REPORTE ---
  async getReporte() {
    // 1. Obtenemos todos los adicionales.
    const adicionales = await this.adicionalRepository.find();

    // 2. Para cada adicional, buscamos sus relaciones y las filtramos en el código.
    const reporte = await Promise.all(
      adicionales.map(async (adicional) => {
        
        // Buscamos todos los vínculos para este adicional, incluyendo la tarifa relacionada
        const vinculos = await this.tarifaAdicionalRepository.find({
          where: { 
            adicional: { idAdicional: adicional.idAdicional }
          },
          // Cargamos la relación con TarifaCosto para poder acceder a 'deletedAt'
          relations: ['tarifa'] 
        });

        // Filtramos en memoria: nos quedamos solo con los vínculos cuya tarifa NO esté borrada.
        const vinculosActivos = vinculos.filter(v => v.tarifa && v.tarifa.deletedAt === null); //deletedAt es null si no está borrada

        // La frecuencia es la cantidad de vínculos activos.
        const frecuenciaDeUso = vinculosActivos.length;

        return {
          idAdicional: adicional.idAdicional,
          descripcion: adicional.descripcion,
          costo: adicional.costo,
          frecuenciaDeUso: frecuenciaDeUso,
        };
      }),
    );

    reporte.sort((a, b) => b.frecuenciaDeUso - a.frecuenciaDeUso);

    return reporte;
  }

  // --- LÓGICA DE OBTENER TARIFAS ---
  async getTarifasForAdicional(idAdicional: number): Promise<TarifaCosto[]> {
    const vinculos = await this.tarifaAdicionalRepository.find({
        where: { 
            adicional: { idAdicional: idAdicional },
            // El filtro en la relación funciona bien con el método .find()
            tarifa: { deletedAt: IsNull() } 
        },
        relations: [
            'tarifa',
            'tarifa.tipoVehiculo',
            'tarifa.zonaDeViaje',
            'tarifa.transportista',
            'tarifa.tipoCarga'
        ],
    });
    
    return vinculos.map(vinculo => vinculo.tarifa).filter(Boolean);
  }
}