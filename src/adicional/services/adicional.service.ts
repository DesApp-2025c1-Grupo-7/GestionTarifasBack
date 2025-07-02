import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adicional } from '../entities/adicional.entity';
import { TarifaAdicional } from '../../tarifa-adicional/entities/tarifa-adicional.entity';
import { CreateAdicionalDTO } from '../dtos/adicional.dto';
import { TarifaCosto } from '../../tarifa-costo/entities/tarifa-costo.entity'; // Importar

@Injectable()
export class AdicionalService {
  constructor(
    @InjectRepository(Adicional)
    private readonly adicionalRepository: Repository<Adicional>,
    
    // Solo necesitamos el repositorio de la tabla intermedia
    @InjectRepository(TarifaAdicional)
    private readonly tarifaAdicionalRepository: Repository<TarifaAdicional>,
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

  // --- LÓGICA DEL REPORTE (CÓDIGO FINAL Y SIMPLIFICADO) ---

  async getReporte() {
    // 1. Obtenemos todos los adicionales base.
    const adicionales = await this.adicionalRepository.find();

    // 2. Para cada adicional, contamos en cuántas tarifas está.
    const reporte = await Promise.all(
      adicionales.map(async (adicional) => {
        
        // Esta es la consulta clave: contamos las filas en TarifaAdicional
        // que corresponden a este ID de adicional.
        const frecuenciaDeUso = await this.tarifaAdicionalRepository.count({
          where: { 
            adicional: { idAdicional: adicional.idAdicional } 
          }
        });

        // 3. Ensamblamos el objeto de respuesta simple.
        return {
          idAdicional: adicional.idAdicional,
          descripcion: adicional.descripcion,
          costo: adicional.costo,
          frecuenciaDeUso: frecuenciaDeUso, // <-- El dato calculado
        };
      }),
    );

    // Opcional: Ordenamos el resultado final por popularidad (de mayor a menor)
    reporte.sort((a, b) => b.frecuenciaDeUso - a.frecuenciaDeUso);

    return reporte;
  }

    async getTarifasForAdicional(idAdicional: number): Promise<TarifaCosto[]> {
    const vinculos = await this.tarifaAdicionalRepository.find({
        where: { adicional: { idAdicional: idAdicional } },
        // Traemos todas las relaciones de la tarifa para mostrarla completa en el frontend
        relations: [
            'tarifa',
            'tarifa.tipoVehiculo',
            'tarifa.zonaDeViaje',
            'tarifa.transportista',
            'tarifa.tipoCarga'
        ],
    });
    // Devolvemos un array que contiene solo los objetos de TarifaCosto
    return vinculos.map(vinculo => vinculo.tarifa).filter(Boolean); // .filter(Boolean) elimina posibles nulos
  }

}
