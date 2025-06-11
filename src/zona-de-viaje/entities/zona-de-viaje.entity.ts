import { on } from "events";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TarifaCosto } from "../../tarifa-costo/entities/tarifa-costo.entity";
import { JoinTable } from "typeorm/decorator/relations/JoinTable";
import { Transportista } from "../../transportista/entities/transportista.entity";
import { ManyToMany } from "typeorm/decorator/relations/ManyToMany";

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

  @ManyToMany(() => Transportista, transportista => transportista.zonasDeViaje)
  transportistas: Transportista[];

  @DeleteDateColumn({ nullable: true })  
  deletedAt: Date | null

}
