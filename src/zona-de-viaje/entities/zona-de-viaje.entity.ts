import { on } from "events";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TarifaCosto } from "../../tarifa-costo/entities/tarifa-costo.entity";

@Entity()
export class ZonaDeViaje {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  origen: string;

  @Column()
  destino: string;

  @Column()
  distancia: number;

  @Column()
  costoKilometro: number;

  @OneToMany(() => TarifaCosto, tarifaCosto => tarifaCosto.zonaDeViaje)
  tarifaCosto: TarifaCosto[];

  @DeleteDateColumn({ nullable: true })  
  deletedAt: Date | null

}
