import { CreateDateColumn, Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { DeleteDateColumn } from "typeorm/decorator/columns/DeleteDateColumn";
import { ManyToOne } from "typeorm";
import { ZonaDeViaje } from "../../zona-de-viaje/entities/zona-de-viaje.entity";
import { Transportista } from "../../transportista/entities/transportista.entity";
import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";

@Entity()
export class TarifaCosto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  valor_base: number;


  @ManyToOne(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.tarifaCosto)
  tipoVehiculo: TipoVehiculo;

  @ManyToOne(() => ZonaDeViaje, zonaDeViaje => zonaDeViaje.tarifaCosto)
  zonaDeViaje: ZonaDeViaje;

  
  @ManyToOne(() => Transportista, transportista => transportista.tarifaCosto)
  transportista: Transportista;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}                           