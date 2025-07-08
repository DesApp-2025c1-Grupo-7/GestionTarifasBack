import { CreateDateColumn, Entity } from "typeorm";
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

  // columnas de vigencia de tarifas
  @Column({ type: 'date', nullable: true, default: null }) // <-- CAMBIO: Se establece un default
  vigenciaDesde: Date;

  @Column({ type: 'date', nullable: true, default: null }) // Se permite que sea nula
  vigenciaHasta: Date;

}                           