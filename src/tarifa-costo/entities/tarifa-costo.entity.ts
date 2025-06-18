import { CreateDateColumn, Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { DeleteDateColumn } from "typeorm/decorator/columns/DeleteDateColumn";
import { ManyToOne } from "typeorm";
import { OneToMany } from "typeorm";
import { Vehiculo } from "../../vehiculo/entities/vehiculo.entity";
import { ZonaDeViaje } from "../../zona-de-viaje/entities/zona-de-viaje.entity";
import { Transportista } from "../../transportista/entities/transportista.entity";

@Entity()
export class TarifaCosto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  valor_base: number;


  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.tarifaCosto)
  vehiculo: Vehiculo;

  @ManyToOne(() => ZonaDeViaje, zonaDeViaje => zonaDeViaje.tarifaCosto)
  zonaDeViaje: ZonaDeViaje;

  
  @ManyToOne(() => Transportista, transportista => transportista.tarifaCosto)
  transportista: Transportista;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

}                           