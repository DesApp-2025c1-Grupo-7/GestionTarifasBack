import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TarifaCosto } from '../entities/tarifa-costo.entity';
import { Repository } from 'typeorm';
import { CreateTarifaCostoDTO } from '../dtos/tarifa-costo.dto';
import { Transportista } from 'src/transportista/entities/transportista.entity';
import { ZonaDeViaje } from 'src/zona-de-viaje/entities/zona-de-viaje.entity';
import { TipoVehiculo } from 'src/tipo-vehiculo/entities/tipo-vehiculo.entity';
import { TipoCarga } from 'src/tipo-carga/entities/tipo-carga.entity';
import { Adicional } from 'src/adicional/entities/adicional.entity';
import { TarifaAdicional } from 'src/tarifa-adicional/entities/tarifa-adicional.entity';

@Injectable()
export class TarifaCostoService {

    constructor(
        @InjectRepository(TarifaCosto) private readonly tarifaCostoRepository: Repository<TarifaCosto>,
        @InjectRepository(Transportista) private readonly transportistaRepository: Repository<Transportista>,
        @InjectRepository(TipoVehiculo) private readonly vehiculoRepo: Repository<TipoVehiculo>,
        @InjectRepository(TipoCarga) private readonly cargaRepo: Repository<TipoCarga>,
        @InjectRepository(ZonaDeViaje) private readonly zonaRepository: Repository<ZonaDeViaje>,
        @InjectRepository(Adicional) private readonly adicionalRepo: Repository<Adicional>,
        @InjectRepository(TarifaAdicional) private readonly tarifaAdicionalRepo: Repository<TarifaAdicional>
    ) { }

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

        try {
            // --- LÓGICA DE VIGENCIA: Validación de fechas --- 
            {/*
            if (dataTarifa.vigenciaHasta && new Date(dataTarifa.vigenciaHasta) < new Date(dataTarifa.vigenciaDesde)) {
                throw new BadRequestException('La fecha de fin de vigencia no puede ser anterior a la fecha de inicio.');
            }
            */} // Comentado porque no se usa en la lógica actual

            const tarifa = await this.tarifaCostoRepository.findOneBy({ id });
            if (!tarifa) throw new NotFoundException('Tarifa de costo no encontrada');

            const tipoVehiculo = await this.vehiculoRepo.findOneBy({ id: dataTarifa.tipoVehiculo });
            if (!tipoVehiculo) throw new BadRequestException('El tipo vehículo especificado no existe.');

            const zonaDeViaje = await this.zonaRepository.findOneBy({ id: dataTarifa.zonaDeViaje });
            if (!zonaDeViaje) throw new BadRequestException('La zona de viaje especificada no existe.');

            const transportista = await this.transportistaRepository.findOneBy({ id: dataTarifa.transportista });
            if (!transportista) throw new BadRequestException('El transportista especificado no existe.');

            const tipoCarga = await this.cargaRepo.findOneBy({ id: dataTarifa.tipoCarga });
            if (!tipoCarga) throw new BadRequestException('El tipo de carga especificado no existe.');

            let costoTotalCalculado = dataTarifa.valorBase;
            if (adicionales && adicionales.length > 0) {
                for (const adicionalDto of adicionales) {
                    costoTotalCalculado += Number(adicionalDto.costo);
                }
            }

            tarifa.valor_base = dataTarifa.valorBase;
            tarifa.tipoVehiculo = tipoVehiculo;
            tarifa.zonaDeViaje = zonaDeViaje;
            tarifa.transportista = transportista;
            tarifa.tipoCarga = tipoCarga;
            tarifa.costo_total = costoTotalCalculado;

            await this.tarifaCostoRepository.save(tarifa);

            if (adicionales) {
                await this.tarifaAdicionalRepo.delete({ tarifa: { id: id } });
                for (const adicionalDto of adicionales) {
                    const adicional = await this.adicionalRepo.findOneBy({ idAdicional: adicionalDto.idAdicional });
                    if (adicional) {
                        // --- CORRECCIÓN FINAL ---
                        // Usamos la propiedad `costoPersonalizado` como está definida en la entidad
                        const nuevoVinculo = this.tarifaAdicionalRepo.create({
                            tarifa: tarifa,
                            adicional: adicional,
                            costoPersonalizado: adicionalDto.costo,
                        });
                        await this.tarifaAdicionalRepo.save(nuevoVinculo);
                    }
                }
            }

            return this.obtenerTarifaPorId(id);

        } catch (error) {
            this.logger.error('Error al actualizar tarifa de costo', error.stack);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Ocurrió un error al actualizar la tarifa de costo.');
        }
    }

    public async eliminarTarifaCosto(id: number): Promise<void> {
        const tarifa = await this.tarifaCostoRepository.findOne({ where: { id } });

        if (!tarifa) {
            throw new NotFoundException('Tarifa de costo no encontrada');
        }

        await this.tarifaCostoRepository.softDelete(id);
    }

    private async obtenerTarifaPorId(id: number): Promise<TarifaCosto> {
        const tarifa = await this.tarifaCostoRepository.findOne({
            where: { id },
            relations: ['zonaDeViaje', 'tipoVehiculo', 'transportista', 'tipoCarga', 'tarifaAdicionales', 'tarifaAdicionales.adicional'],
        });
        if (!tarifa) {
            throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
        }
        return tarifa;
    }
}