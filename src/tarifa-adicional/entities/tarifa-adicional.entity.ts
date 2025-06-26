import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Adicional } from '../../adicional/entities/adicional.entity';
import { TarifaCosto } from '../../tarifa-costo/entities/tarifa-costo.entity';

@Entity()
export class TarifaAdicional {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => TarifaCosto, tarifa => tarifa.tarifaAdicionales, { onDelete: 'CASCADE' })
  tarifa: TarifaCosto;

  @ManyToOne(() => Adicional, adicional => adicional.tarifaAdicionales, { onDelete: 'CASCADE' })
  adicional: Adicional;

  @Column('float', { default: 0 })
  costoPersonalizado: number;
}
