import { on } from 'events';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { DeleteDateColumn } from 'typeorm/decorator/columns/DeleteDateColumn';
import { TarifaAdicional } from '../../tarifa-adicional/entities/tarifa-adicional.entity';

@Entity('adicional')
export class Adicional {
  @PrimaryGeneratedColumn({ name: 'id_adicional' })
  idAdicional: number;

  @Column({ type: 'char', length: 255 })
  descripcion: string;

  @Column({ type: 'float', default: 0 })
  costo: number;

  @Column({ type: 'boolean', default: false, name: 'es_obligatorio' })
  esObligatorio: boolean;

  @OneToMany(() => TarifaAdicional, tarifaAdicional => tarifaAdicional.adicional, { cascade: true })
  tarifaAdicionales: TarifaAdicional[]; 

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

