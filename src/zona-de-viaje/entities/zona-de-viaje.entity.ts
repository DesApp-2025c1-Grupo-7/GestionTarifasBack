import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}