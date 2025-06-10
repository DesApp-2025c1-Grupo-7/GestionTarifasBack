import { Vehiculo } from "src/vehiculo/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TarifaCosto } from "src/tarifa-costo/entities/tarifa-costo.entity";


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

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
