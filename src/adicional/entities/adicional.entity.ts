import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DeleteDateColumn } from 'typeorm/decorator/columns/DeleteDateColumn';

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

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}