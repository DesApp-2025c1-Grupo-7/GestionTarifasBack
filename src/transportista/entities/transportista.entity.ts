import { Vehiculo } from "src/vehiculo/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TarifaCosto } from "src/tarifa-costo/entities/tarifa-costo.entity";
import { ZonaDeViaje } from "src/zona-de-viaje/entities/zona-de-viaje.entity";
import { JoinTable } from "typeorm/decorator/relations/JoinTable";

@Entity()
export class Transportista {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nombre: string;

  @Column()
  costoServicio: number;

  @Column()
  contacto: string;

  @Column()
  telefono: string;

  @OneToMany(() => Vehiculo, vehiculo => vehiculo.transportista, { cascade: true })
  vehiculos: Vehiculo[];

  @OneToMany(() => TarifaCosto, tarifaCosto => tarifaCosto.transportista, { cascade: true })
  tarifaCosto: TarifaCosto[];

  @ManyToMany(() => ZonaDeViaje, zonaDeViaje => zonaDeViaje.transportistas)
  @JoinTable({
    name: 'transportista_zona'
  })
  zonasDeViaje: ZonaDeViaje[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
