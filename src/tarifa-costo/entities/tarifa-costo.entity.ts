import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { DeleteDateColumn } from "typeorm/decorator/columns/DeleteDateColumn";
import { ManyToOne, OneToMany } from "typeorm";
import { ZonaDeViaje } from "../../zona-de-viaje/entities/zona-de-viaje.entity";
import { Transportista } from "../../transportista/entities/transportista.entity";
import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";
import { TarifaAdicional } from "../../tarifa-adicional/entities/tarifa-adicional.entity";
import { TipoCarga } from "src/tipo-carga/entities/tipo-carga.entity";

@Entity()
export class TarifaCosto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  valor_base: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_total: number;

  @Column({ type: 'int', default: 1 })
  version: number;

  @ManyToOne(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.tarifaCosto)
  tipoVehiculo: TipoVehiculo;

  @ManyToOne(() => ZonaDeViaje, zonaDeViaje => zonaDeViaje.tarifaCosto)
  zonaDeViaje: ZonaDeViaje;

  @ManyToOne(() => Transportista, transportista => transportista.tarifaCosto)
  transportista: Transportista;

  @ManyToOne(() => TipoCarga, tipoCarga => tipoCarga.tarifaCosto)
  tipoCarga: TipoCarga;

  @OneToMany(() => TarifaAdicional, tarifaAdicional => tarifaAdicional.tarifa)
  tarifaAdicionales: TarifaAdicional[];

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // --- CAMBIO: Se ajusta el tipo para permitir null ---
  @Column({ type: 'date', nullable: true, default: null })
  vigenciaDesde: Date | null;

  // --- CAMBIO: Se ajusta el tipo para permitir null ---
  @Column({ type: 'date', nullable: true, default: null })
  vigenciaHasta: Date | null;
}