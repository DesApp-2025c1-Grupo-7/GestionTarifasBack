import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tarifas_costo_historial')
export class TarifaCostoHistorial {
  @PrimaryGeneratedColumn()
  id_historial: number;

  @Column()
  id_tarifa: number;

  @Column()
  version: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_base: number;

  @Column('decimal', { precision: 10, scale: 2 })
  costo_total: number;

  @Column({ nullable: true })
  id_tipo_vehiculo: number;

  @Column({ nullable: true })
  id_zona_de_viaje: number;

  @Column({ nullable: true })
  id_transportista: number;

  @Column({ nullable: true })
  id_tipo_carga: number;
  
  @Column({ type: 'json', nullable: true })
  adicionales: object[];
  
  @Column({ type: 'date', nullable: true })
  vigenciaDesde: Date | null;

  @Column({ type: 'date', nullable: true })
  vigenciaHasta: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_modificacion: Date;
}
