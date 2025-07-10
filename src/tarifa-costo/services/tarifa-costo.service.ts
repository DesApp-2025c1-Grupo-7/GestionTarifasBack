import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TarifaCosto } from '../entities/tarifa-costo.entity';
import { Repository, DataSource, DeepPartial, LessThanOrEqual, Between } from 'typeorm';
import { CreateTarifaCostoDTO } from  '../dtos/tarifa-costo.dto';
import { Transportista } from 'src/transportista/entities/transportista.entity';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';
import { Adicional } from 'src/adicional/entities/adicional.entity';
import { TarifaAdicional } from 'src/tarifa-adicional/entities/tarifa-adicional.entity';
import { TarifaCostoHistorial } from '../entities/tarifa-costo-historial.entity';

@Injectable()
export class TarifaCostoService {

    constructor(
        @InjectRepository(TarifaCosto) private readonly tarifaCostoRepository: Repository<TarifaCosto>,
        @InjectRepository(Transportista) private readonly transportistaRepository: Repository<Transportista>,
        @InjectRepository(TipoVehiculo) private readonly vehiculoRepo: Repository<TipoVehiculo>,
        @InjectRepository(TipoCarga) private readonly cargaRepo: Repository<TipoCarga>,
        @InjectRepository(ZonaDeViaje) private readonly zonaRepository: Repository<ZonaDeViaje>,
        @InjectRepository(Adicional) private readonly adicionalRepo: Repository<Adicional>,
        @InjectRepository(TarifaAdicional) private readonly tarifaAdicionalRepo: Repository<TarifaAdicional>,
        @InjectRepository(TarifaCostoHistorial) private readonly historialRepo: Repository<TarifaCostoHistorial>,
        private readonly dataSource: DataSource,
    ) {}

    private readonly logger = new Logger(TarifaCostoService.name);

    public async obtenerTarifasCosto(): Promise<TarifaCosto[]> {
        const tarifasCosto: TarifaCosto[] = await this.tarifaCostoRepository.find({
            relations: [
            'zonaDeViaje',
            'tipoVehiculo',
            'transportista',
            'tipoCarga',
            'tarifaAdicionales',
            'tarifaAdicionales.adicional'
            ],
            withDeleted: true 
        });
   	return tarifasCosto;
   }
    public async crearTarifaCosto(body: CreateTarifaCostoDTO): Promise<TarifaCosto> {
        const { adicionales, ...dataTarifa } = body;
        
        try {
            // --- LÓGICA DE VIGENCIA: Validación de fechas ---
            {/*
            if (dataTarifa.vigenciaHasta && new Date(dataTarifa.vigenciaHasta) < new Date(dataTarifa.vigenciaDesde)) {
                throw new BadRequestException('La fecha de fin de vigencia no puede ser anterior a la fecha de inicio.');
            }
            */} // Comentado porque no se usa en la lógica actual

            const tipoVehiculo = await this.vehiculoRepo.findOneBy({ id: dataTarifa.tipoVehiculo });
            if (!tipoVehiculo) throw new BadRequestException('El tipo vehículo especificado no existe.');

            const zonaDeViaje = await this.zonaRepository.findOneBy({ id: dataTarifa.zonaDeViaje });
            if (!zonaDeViaje) throw new BadRequestException('La zona de viaje especificada no existe.');

            const transportista = await this.transportistaRepository.findOneBy({ id: dataTarifa.transportista });
            if (!transportista) throw new BadRequestException('El transportista especificado no existe.');

            const carga = await this.cargaRepo.findOneBy({ id: dataTarifa.tipoCarga });
            if (!carga) throw new BadRequestException('El tipo de carga especificado no existe.');

            const tarifaExistente = await this.tarifaCostoRepository.findOne({
                where: {
                    tipoVehiculo: { id: dataTarifa.tipoVehiculo },
                    zonaDeViaje: { id: dataTarifa.zonaDeViaje },
                    tipoCarga: { id: dataTarifa.tipoCarga },
                    transportista: { id: dataTarifa.transportista },
                    valor_base:body.valorBase,
                }
            });

            if (tarifaExistente) {
                throw new BadRequestException('Ya existe una tarifa de costo con las mismas características.');
            }

            let costoTotalCalculado = dataTarifa.valorBase;
            if (adicionales && adicionales.length > 0) {
                for (const adicionalDto of adicionales) {
                    costoTotalCalculado += Number(adicionalDto.costo);
                }
            }

            const nuevaTarifa = this.tarifaCostoRepository.create({
                valor_base: dataTarifa.valorBase,
                zonaDeViaje,
                tipoVehiculo,
                tipoCarga: carga,
                transportista,
                costo_total: costoTotalCalculado,
                vigenciaDesde: dataTarifa.vigenciaDesde,
                vigenciaHasta: dataTarifa.vigenciaHasta,
            });

            const tarifaGuardada = await this.tarifaCostoRepository.save(nuevaTarifa);

            if (adicionales && adicionales.length > 0) {
                for (const adicionalDto of adicionales) {
                    const adicional = await this.adicionalRepo.findOneBy({ idAdicional: adicionalDto.idAdicional });
                    if (adicional) {
                        // --- CORRECCIÓN FINAL ---
                        // Usamos la propiedad `costoPersonalizado` como está definida en la entidad
                        const nuevoVinculo = this.tarifaAdicionalRepo.create({
                            tarifa: tarifaGuardada,
                            adicional: adicional,
                            costoPersonalizado: adicionalDto.costo, 
                        });
                        await this.tarifaAdicionalRepo.save(nuevoVinculo);
                    }
                }
            }

            return this.obtenerTarifaPorId(tarifaGuardada.id);

        } catch (error) {
            this.logger.error('Error al crear la tarifa de costo', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Ocurrió un error al crear la tarifa de costo.');
        }
    }

    public async actualizarTarifaCosto(id: number, body: CreateTarifaCostoDTO): Promise<TarifaCosto> {
    const { adicionales, ...dataTarifa } = body;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tarifaActual = await queryRunner.manager.findOne(TarifaCosto, {
        where: { id },
        relations: ['tipoVehiculo', 'zonaDeViaje', 'transportista', 'tipoCarga', 'tarifaAdicionales', 'tarifaAdicionales.adicional'],
      });
      if (!tarifaActual) throw new NotFoundException('Tarifa de costo no encontrada');

// --- CORRECCIÓN 1: Manejo seguro de adicionales que podrían ser nulos ---
    const adicionalesAntiguos = tarifaActual.tarifaAdicionales
                .filter(ta => ta.adicional) // Filtra los que no tienen un adicional válido
                .map(ta => ({ // Ahora mapea con la seguridad de que ta.adicional existe
                    idAdicional: ta.adicional.idAdicional,
                    descripcion: ta.adicional.descripcion,
                    costo: ta.costoPersonalizado
                }));

      
      // --- CORRECCIÓN: Se crea el objeto de historial explícitamente con su tipo ---
            const historialData: DeepPartial<TarifaCostoHistorial> = {
                id_tarifa: tarifaActual.id,
                version: tarifaActual.version,
                valor_base: tarifaActual.valor_base,
                costo_total: tarifaActual.costo_total,
                id_tipo_vehiculo: tarifaActual.tipoVehiculo?.id,
                id_zona_de_viaje: tarifaActual.zonaDeViaje?.id,
                id_transportista: tarifaActual.transportista?.id,
                id_tipo_carga: tarifaActual.tipoCarga?.id,
                adicionales: adicionalesAntiguos,
                vigenciaDesde: tarifaActual.vigenciaDesde,
                vigenciaHasta: tarifaActual.vigenciaHasta,
            };
            
            const historial = this.historialRepo.create(historialData);
            await queryRunner.manager.save(historial);

      const tipoVehiculo = await this.vehiculoRepo.findOneBy({ id: dataTarifa.tipoVehiculo });
      const zonaDeViaje = await this.zonaRepository.findOneBy({ id: dataTarifa.zonaDeViaje });
      const transportista = await this.transportistaRepository.findOneBy({ id: dataTarifa.transportista });
      const tipoCarga = await this.cargaRepo.findOneBy({ id: dataTarifa.tipoCarga });
      if (!tipoVehiculo || !zonaDeViaje || !transportista || !tipoCarga) {
          throw new BadRequestException('Alguna de las entidades relacionadas no existe.');
      }
      
      let costoTotalCalculado = dataTarifa.valorBase;
      if (adicionales && adicionales.length > 0) {
        costoTotalCalculado += adicionales.reduce((sum, ad) => sum + Number(ad.costo), 0);
      }

      tarifaActual.valor_base = dataTarifa.valorBase;
      tarifaActual.tipoVehiculo = tipoVehiculo;
      tarifaActual.zonaDeViaje = zonaDeViaje;
      tarifaActual.transportista = transportista;
      tarifaActual.tipoCarga = tipoCarga;
      tarifaActual.costo_total = costoTotalCalculado;
      tarifaActual.version += 1;
    //  vigenciaDesde: tarifaActual.vigenciaDesde,
     // vigenciaHasta: tarifaActual.vigenciaHasta,
      
      await queryRunner.manager.save(tarifaActual);

      await queryRunner.manager.delete(TarifaAdicional, { tarifa: { id } });
      if (adicionales && adicionales.length > 0) {
        for (const ad of adicionales) {
          const adicionalEntity = await this.adicionalRepo.findOneBy({ idAdicional: ad.idAdicional });
          if (adicionalEntity) {
            const nuevoVinculo = this.tarifaAdicionalRepo.create({
              tarifa: tarifaActual,
              adicional: adicionalEntity,
              costoPersonalizado: ad.costo,
            });
            await queryRunner.manager.save(nuevoVinculo);
          }
        }
      }

      await queryRunner.commitTransaction();
      
      return this.obtenerTarifaPorId(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error al actualizar tarifa de costo', error.stack);
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Ocurrió un error al actualizar la tarifa de costo.');
    } finally {
      await queryRunner.release();
    }
  }

    public async eliminarTarifaCosto(id: number): Promise<void> {
        const tarifa = await this.tarifaCostoRepository.findOne({ where: { id } });

        if (!tarifa) {
            throw new NotFoundException('Tarifa de costo no encontrada');
        }
        
        await this.tarifaCostoRepository.softDelete(id);
    }   

    public async obtenerTarifaPorId(id: number): Promise<TarifaCosto> {
        const tarifa = await this.tarifaCostoRepository.findOne({
            where: { id },
            relations: ['zonaDeViaje', 'tipoVehiculo', 'transportista', 'tipoCarga', 'tarifaAdicionales', 'tarifaAdicionales.adicional'],
        });
        if (!tarifa) {
            throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
        }
        return tarifa;
    }
    public async obtenerHistorialDeTarifa(id: number): Promise<TarifaCostoHistorial[]> {
        return this.historialRepo.find({
            where: { id_tarifa: id },
            order: { version: 'DESC' }
        });
    }
    //////////////////Lo nuevo----------------
    // --- MÉTODO DE ANÁLISIS COMPARATIVO REESCRITO Y CORREGIDO ---
    public async getAnalisisComparativo(fechaInicio: string, fechaFin: string) {
        if (!fechaInicio || !fechaFin) {
            throw new BadRequestException('Debe proporcionar una fecha de inicio y una fecha de fin.');
        }

        // 1. Encontrar todas las tarifas que fueron actualizadas dentro del rango de fechas.
        //    Estas son nuestras "versiones finales".
        const tarifasFin = await this.tarifaCostoRepository.find({
            where: {
                updatedAt: Between(new Date(fechaInicio), new Date(fechaFin))
            },
            relations: ['transportista', 'zonaDeViaje'],
        });

        if (tarifasFin.length === 0) {
            return []; // Si no se actualizó ninguna tarifa, no hay nada que analizar.
        }

        // 2. Recopilar los IDs y las versiones anteriores que necesitamos buscar en el historial.
        const historialLookups = tarifasFin.map(t => ({
            id_tarifa: t.id,
            version: t.version - 1
        }));
        
        // 3. Obtener todas las "versiones iniciales" necesarias desde el historial en una sola consulta.
        const tarifasInicio = await this.historialRepo.find({
            where: historialLookups
        });

        // 4. Mapear las versiones iniciales para un acceso rápido.
        const mapaTarifasInicio = new Map(tarifasInicio.map(t => [`${t.id_tarifa}-${t.version}`, t]));

        // 5. Calcular las variaciones.
        const resultados = tarifasFin.map(tarifaFin => {
            const tarifaInicio = mapaTarifasInicio.get(`${tarifaFin.id}-${tarifaFin.version - 1}`);

            // Si no encontramos una versión anterior, significa que la tarifa se creó en este período, no se actualizó.
            if (!tarifaInicio) {
                return null;
            }

            const costoInicial = Number(tarifaInicio.costo_total);
            const costoFinal = Number(tarifaFin.costo_total);

            // Si no hubo cambio en el costo, no lo incluimos en el reporte de aumentos.
            if (costoInicial === costoFinal) {
                return null;
            }

            const variacionAbsoluta = costoFinal - costoInicial;
            const variacionPorcentual = costoInicial !== 0 ? (variacionAbsoluta / costoInicial) * 100 : 0;

            const descripcion = `${tarifaFin.transportista?.nombre || 'N/A'} | ${tarifaFin.zonaDeViaje?.origen || '?'} - ${tarifaFin.zonaDeViaje?.destino || '?'}`;

            return {
                id_tarifa: tarifaFin.id,
                descripcion: descripcion,
                costo_inicial: costoInicial,
                costo_final: costoFinal,
                variacion_absoluta: variacionAbsoluta,
                variacion_porcentual: variacionPorcentual,
            };
        }).filter(Boolean); // Limpiar los resultados nulos.

        return resultados;
    }
}