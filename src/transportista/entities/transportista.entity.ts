import { Vehiculo } from "src/vehiculo/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



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


  @OneToMany(() => Vehiculo, vehiculo => vehiculo.transportista)
  vehiculos: Vehiculo[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
